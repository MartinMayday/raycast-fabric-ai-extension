# Implementation Plan

- [ ] 1. Set up Notion integration dependencies and configuration
  - Add @notionhq/client dependency to package.json
  - Update TypeScript interfaces to include Notion preferences
  - Create basic project structure for Notion integration files
  - _Requirements: 2.1, 2.2_

- [ ] 2. Create core Notion service infrastructure
  - [ ] 2.1 Implement NotionService class with API client initialization
    - Create src/services/NotionService.ts with Client initialization
    - Implement constructor that accepts NotionConfig interface
    - Add basic connection validation method
    - Write unit tests for service initialization
    - _Requirements: 2.2, 4.1_

  - [ ] 2.2 Add Notion preferences to extension configuration
    - Extend Preferences interface to include notionApiToken and notionDatabaseId
    - Update preference validation logic in main component
    - Add preference access methods with proper error handling
    - _Requirements: 2.1, 2.2, 2.3_

- [ ] 3. Implement unified data mapping and export logic
  - [ ] 3.1 Create UnifiedDatabaseExporter class with dual export capability
    - Implement UnifiedDatabaseExporter.ts that handles both Notion and CSV export
    - Create mapDataToNotionProperties method for Notion transformation
    - Create mapDataToCSVRow method for CSV transformation
    - Add array field handling for both export formats
    - Write unit tests for data transformation accuracy
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 3.2 Implement simultaneous Notion and CSV export functionality
    - Add exportToDatabase method that calls both Notion and CSV exporters
    - Implement proper error handling for partial failures (Notion fails but CSV succeeds)
    - Add content truncation logic for Notion text limits while preserving full data in CSV
    - Create integration tests for dual export process
    - _Requirements: 1.2, 1.3, 3.1, 3.4_

- [ ] 4. Add unified database export action to user interface
  - [ ] 4.1 Replace existing export with unified "Send to Database" action
    - Replace existing "Export to Spreadsheet" action with "Send to Database"
    - Implement exportToDatabase method that handles both Notion and CSV simultaneously
    - Add proper loading states and user feedback for dual export process
    - _Requirements: 1.1, 1.4_

  - [ ] 4.2 Implement comprehensive error handling and user feedback
    - Create NotionErrorHandler class for API error translation
    - Add user-friendly error messages for common failure scenarios
    - Implement toast notifications for success and error states
    - Add debug logging integration for troubleshooting
    - _Requirements: 2.3, 4.1, 4.2, 4.3, 4.4_

- [ ] 5. Add connection validation and configuration helpers
  - [ ] 5.1 Implement Notion connection testing functionality
    - Add validateConnection method to NotionService
    - Create test connection action in UI for user validation
    - Implement database property validation
    - _Requirements: 2.3, 5.2, 5.3_

  - [ ] 5.2 Add database property validation and guidance
    - Implement getDatabaseProperties method in NotionService
    - Add property existence validation before export
    - Create helpful error messages for missing properties
    - _Requirements: 3.2, 5.4_

- [ ] 6. Implement robust error handling and edge cases
  - [ ] 6.1 Add comprehensive API error handling
    - Implement specific error handling for authentication failures
    - Add network timeout and retry logic with exponential backoff
    - Handle rate limiting with appropriate delays
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 6.2 Handle data validation and content limits
    - Implement content truncation for large text fields
    - Add data type validation and conversion
    - Handle special characters and encoding issues
    - _Requirements: 3.3, 3.4_

- [ ] 7. Create comprehensive test suite
  - [ ] 7.1 Write unit tests for core functionality
    - Create tests for NotionService API interactions
    - Add tests for NotionExporter data transformation
    - Implement tests for error handling scenarios
    - _Requirements: 4.1, 4.4_

  - [ ] 7.2 Add integration tests for end-to-end functionality
    - Create tests for complete export workflow
    - Add tests for preference validation and configuration
    - Implement tests for various content types and edge cases
    - _Requirements: 1.1, 1.3, 1.4_

- [ ] 8. Add configuration validation and user guidance
  - [ ] 8.1 Implement preference validation on startup
    - Add validation for API token format and accessibility
    - Validate database ID format and existence
    - Create helpful setup guidance for new users
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 8.2 Add database setup validation and guidance
    - Implement database property requirement checking
    - Create clear error messages for missing properties
    - Add guidance for database configuration
    - _Requirements: 3.2, 5.1, 5.2, 5.3, 5.4_

- [ ] 9. Integrate unified export with existing functionality
  - [ ] 9.1 Update main component to use unified database export
    - Modify ExtractWisdomUltimate component to use UnifiedDatabaseExporter
    - Replace existing CSV export logic with unified approach
    - Ensure backward compatibility while providing enhanced functionality
    - Add proper action ordering and visual hierarchy
    - _Requirements: 1.1, 1.4_

  - [ ] 9.2 Add export preferences and success tracking
    - Allow users to configure Notion as primary with CSV as automatic backup
    - Add keyboard shortcuts for quick database export actions
    - Implement export history and success tracking for both formats
    - Add option to disable Notion export and use CSV-only mode
    - _Requirements: 1.4, 5.1_

- [ ] 10. Final integration testing and polish
  - [ ] 10.1 Conduct end-to-end testing with real Notion database
    - Test complete workflow from extraction to Notion page creation
    - Verify all 20 data columns appear correctly in Notion
    - Test with various content types (text, YouTube, clipboard)
    - _Requirements: 1.1, 1.3, 1.4, 3.1_

  - [ ] 10.2 Add final polish and user experience improvements
    - Optimize loading states and progress indicators
    - Add success notifications with links to created Notion pages
    - Implement proper cleanup and resource management
    - _Requirements: 1.4, 4.4_