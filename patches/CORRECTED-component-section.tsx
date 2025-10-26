        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => activeTab === 0 ? fetchMatchedJobs() : fetchAllJobs()}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={createSampleJobs}
          >
            Create Sample Jobs
          </Button>
        </Box>

        <NaturalLanguageSearch onSearch={handleNaturalLanguageSearch} />

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab 
            label="Matched Jobs" 
            icon={<TrendingUp />} 
            iconPosition="start"
          />
          <Tab 
            label="All Jobs" 
            icon={<Work />} 
            iconPosition="start"
          />
        </Tabs>
