// Phase 7.1: Job Board Connection Management Service
import { pool } from '../config/database';
import { UserJobBoardConnection, ConnectionHealth } from '../types/jobBoard';
import { jobBoardOAuthService } from './jobBoardOAuthService';

export class JobBoardConnectionService {
  /**
   * Get all connections for a user
   */
  async getUserConnections(userId: string): Promise<UserJobBoardConnection[]> {
    const query = `
      SELECT 
        c.*,
        p.name as provider_name,
        p.display_name as provider_display_name,
        p.logo_url as provider_logo_url
      FROM user_job_board_connections c
      JOIN job_board_providers p ON c.provider_id = p.id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  /**
   * Create new connection
   */
  async createConnection(
    userId: string,
    providerId: string,
    accessToken: string,
    refreshToken: string | null,
    expiresIn: number
  ): Promise<UserJobBoardConnection> {
    // Encrypt tokens before storing
    const encryptedAccessToken = jobBoardOAuthService.encryptToken(accessToken);
    const encryptedRefreshToken = refreshToken 
      ? jobBoardOAuthService.encryptToken(refreshToken)
      : null;

    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    const query = `
      INSERT INTO user_job_board_connections 
        (user_id, provider_id, access_token, refresh_token, token_expires_at, connection_status)
      VALUES ($1, $2, $3, $4, $5, 'active')
      ON CONFLICT (user_id, provider_id) 
      DO UPDATE SET
        access_token = $3,
        refresh_token = $4,
        token_expires_at = $5,
        connection_status = 'active',
        updated_at = NOW()
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
      providerId,
      encryptedAccessToken,
      encryptedRefreshToken,
      expiresAt
    ]);

    return result.rows[0];
  }

  /**
   * Get connection by ID
   */
  async getConnection(connectionId: string): Promise<UserJobBoardConnection | null> {
    const query = `
      SELECT * FROM user_job_board_connections
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [connectionId]);
    return result.rows[0] || null;
  }

  /**
   * Refresh expired token
   */
  async refreshConnection(connectionId: string): Promise<void> {
    const connection = await this.getConnection(connectionId);
    if (!connection || !connection.refresh_token) {
      throw new Error('Connection not found or no refresh token available');
    }

    try {
      // Get provider info
      const providerQuery = `
        SELECT name FROM job_board_providers WHERE id = $1
      `;
      const providerResult = await pool.query(providerQuery, [connection.provider_id]);
      const providerName = providerResult.rows[0].name;

      // Decrypt refresh token
      const refreshToken = jobBoardOAuthService.decryptToken(connection.refresh_token);

      // Get new access token
      const tokenData = await jobBoardOAuthService.refreshAccessToken(
        providerName,
        refreshToken
      );

      // Encrypt and update
      const encryptedAccessToken = jobBoardOAuthService.encryptToken(tokenData.access_token);
      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

      const updateQuery = `
        UPDATE user_job_board_connections
        SET 
          access_token = $1,
          token_expires_at = $2,
          connection_status = 'active',
          error_message = NULL,
          updated_at = NOW()
        WHERE id = $3
      `;

      await pool.query(updateQuery, [encryptedAccessToken, expiresAt, connectionId]);
    } catch (error) {
      // Mark connection as error
      await this.markConnectionError(connectionId, (error as Error).message);
      throw error;
    }
  }

  /**
   * Disconnect (revoke) a connection
   */
  async disconnectConnection(connectionId: string): Promise<void> {
    const query = `
      UPDATE user_job_board_connections
      SET 
        connection_status = 'revoked',
        access_token = NULL,
        refresh_token = NULL,
        updated_at = NOW()
      WHERE id = $1
    `;

    await pool.query(query, [connectionId]);
  }

  /**
   * Mark connection as error
   */
  async markConnectionError(connectionId: string, errorMessage: string): Promise<void> {
    const query = `
      UPDATE user_job_board_connections
      SET 
        connection_status = 'error',
        error_message = $1,
        updated_at = NOW()
      WHERE id = $2
    `;

    await pool.query(query, [errorMessage, connectionId]);
  }

  /**
   * Check connection health
   */
  async checkConnectionHealth(userId: string): Promise<ConnectionHealth[]> {
    const connections = await this.getUserConnections(userId);
    
    return connections.map(conn => ({
      provider_id: conn.provider_id,
      provider_name: (conn as any).provider_display_name,
      is_connected: conn.connection_status === 'active',
      status: conn.connection_status,
      last_sync: conn.last_sync_at || null,
      error_message: conn.error_message,
      requires_reauth: conn.connection_status === 'expired' || conn.connection_status === 'error'
    }));
  }

  /**
   * Update last sync time
   */
  async updateLastSync(connectionId: string): Promise<void> {
    const query = `
      UPDATE user_job_board_connections
      SET last_sync_at = NOW()
      WHERE id = $1
    `;

    await pool.query(query, [connectionId]);
  }

  /**
   * Get active connections for user
   */
  async getActiveConnections(userId: string): Promise<UserJobBoardConnection[]> {
    const query = `
      SELECT 
        c.*,
        p.name as provider_name,
        p.api_base_url
      FROM user_job_board_connections c
      JOIN job_board_providers p ON c.provider_id = p.id
      WHERE c.user_id = $1 
        AND c.connection_status = 'active'
        AND (c.token_expires_at IS NULL OR c.token_expires_at > NOW())
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows;
  }
}

export const jobBoardConnectionService = new JobBoardConnectionService();
