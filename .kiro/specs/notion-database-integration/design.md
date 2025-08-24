# Design Document

## Overview

The Database Integration feature extends the existing Raycast Fabric AI extension by adding unified database storage that combines Notion integration with CSV backup. This feature allows users to send their extracted results to both a Notion database (primary storage) and CSV file (backup/software independence) simultaneously through a single "Send to Database" action. The integration leverages the official Notion API (@notionhq/client) while maintaining CSV compatibility for software independence and easy data portability.

## Architecture

### High-Level Architecture

```
Raycast Extension
├── Existing Components
│   ├── ExtractWisdomUltimate.tsx (main component)
│   ├── CSV Export (exportToSpreadsheet)
│   └── Preferences System
└── New Components
    ├── NotionService.ts (API integration)
    ├── NotionExporter.ts (data mapping)
    └── Enhanced Preferences (Notion config)
```

### Integration Points

1. **Action Panel Enhancement**: Replace existing "Export to Spreadsheet" with unified "Send to Database" action
2. **Preferences Extension**: Add Notion API token and database ID configuration
3. **Service Layer**: Create dedicated Notion service for API interactions
4. **Data Mapping**: Transform ExtractedWisdom interface to Notion page properties

## Components and Interfaces

### 1. NotionService.ts

**Purpose**: Handle all Notion API interactions with proper error handling and authentication.

```typescript
interface NotionConfig {
  apiToken: string;
  databaseId: string;
}

interface NotionPageResponse {
  id: string;
  url: string;
  created_time: string;
}

class NotionService {
  private client: Client;
  
  constructor(config: NotionConfig);
  async createPage(data: ExtractedWisdom): Promise<NotionPageResponse>;
  async validateConnection(): Promise<boolean>;
  async getDatabaseProperties(): Promise<DatabaseProperty[]>;
}
```

### 2. UnifiedDatabaseExporter.ts

**Purpose**: Handle simultaneous export to both Notion database and CSV file for software independence.

```typescript
interface DatabaseExportResult {
  notion: NotionPageResponse;
  csv: {
    filePath: string;
    success: boolean;
  };
}

class UnifiedDatabaseExporter {
  private notionService: NotionService;
  private csvExporter: CSVExporter;
  
  async exportToDatabase(data: ExtractedWisdom): Promise<DatabaseExportResult>;
  private async exportToNotion(data: ExtractedWisdom): Promise<NotionPageResponse>;
  private async exportToCSV(data: ExtractedWisdom): Promise<{filePath: string; success: boolean}>;
  private mapDataToNotionProperties(data: ExtractedWisdom): NotionPageProperties;
  private mapDataToCSVRow(data: ExtractedWisdom): string[];
}
```

### 3. Enhanced Preferences Interface

```typescript
interface Preferences {
  // Existing preferences
  fabricInstallPath?: string;
  maxContentLength?: string;
  timeoutSeconds?: string;
  exportPath?: string;
  
  // New Notion preferences
  notionApiToken?: string;
  notionDatabaseId?: string;
  notionEnabled?: boolean;
}
```

## Data Models

### CSV to Notion Property Mapping

Based on the existing 20-column CSV structure, here's the mapping to Notion database properties:

| CSV Column | Notion Property | Type | Notes |
|------------|----------------|------|-------|
| Date | Date | date | ISO timestamp |
| Author | Author | rich_text | Content creator/channel |
| Hook | Hook | rich_text | Key quote or idea |
| Source Type | Source Type | select | text/youtube/url/clipboard |
| Pattern Type | Pattern Type | select | extract_wisdom (expandable) |
| Extracted Content Full | Content | rich_text | Full wisdom output |
| Summary | Summary | rich_text | Condensed summary |
| Ideas | Ideas | rich_text | Semicolon-separated list |
| Insights | Insights | rich_text | Semicolon-separated list |
| Notable Quotes | Quotes | rich_text | Semicolon-separated list |
| Habits | Habits | rich_text | Semicolon-separated list |
| Facts | Facts | rich_text | Semicolon-separated list |
| References | References | rich_text | Semicolon-separated list |
| One-Sentence Takeaway | Takeaway | rich_text | Key learning |
| Recommendations | Recommendations | rich_text | Semicolon-separated list |
| YouTube Channel | Channel | rich_text | Video source channel |
| CTA URLs | CTA URLs | rich_text | Call-to-action links |
| Connect with Hosts | Connect | rich_text | Contact information |
| Pattern Suggest Next | Next Patterns | rich_text | Suggested follow-up patterns |
| Original URL | Original URL | url | Source URL when applicable |

### Notion Page Structure

```typescript
interface NotionPageProperties {
  "Date": { date: { start: string } };
  "Author": { rich_text: [{ text: { content: string } }] };
  "Hook": { rich_text: [{ text: { content: string } }] };
  "Source Type": { select: { name: string } };
  "Pattern Type": { select: { name: string } };
  "Content": { rich_text: [{ text: { content: string } }] };
  "Summary": { rich_text: [{ text: { content: string } }] };
  // ... additional properties following same pattern
}
```

## Error Handling

### Error Categories and Responses

1. **Authentication Errors**
   - Invalid API token → Guide user to regenerate token
   - Insufficient permissions → Explain required permissions

2. **Database Errors**
   - Database not found → Verify database ID and permissions
   - Missing properties → List required properties to create

3. **Data Validation Errors**
   - Content too long → Truncate with warning
   - Invalid property types → Convert or skip with notification

4. **Network Errors**
   - Connection timeout → Retry with exponential backoff
   - Rate limiting → Queue requests with appropriate delays

### Error Handling Implementation

```typescript
class NotionErrorHandler {
  static handleApiError(error: APIResponseError): UserFriendlyError {
    switch (error.code) {
      case 'unauthorized':
        return new UserFriendlyError(
          'Authentication Failed',
          'Please check your Notion API token in preferences'
        );
      case 'object_not_found':
        return new UserFriendlyError(
          'Database Not Found',
          'Verify your database ID and ensure the integration has access'
        );
      // Additional error mappings...
    }
  }
}
```

## Testing Strategy

### Unit Testing

1. **NotionService Tests**
   - API client initialization
   - Authentication validation
   - Page creation with various data types
   - Error handling for different API responses

2. **NotionExporter Tests**
   - Data transformation accuracy
   - Property mapping completeness
   - Array field handling
   - Content truncation logic

3. **Integration Tests**
   - End-to-end export flow
   - Preference validation
   - Error recovery scenarios

### Manual Testing Scenarios

1. **Happy Path Testing**
   - Configure valid API token and database ID
   - Extract wisdom from various content types
   - Verify all data appears correctly in Notion

2. **Error Scenario Testing**
   - Invalid API token
   - Inaccessible database
   - Missing database properties
   - Network connectivity issues

3. **Edge Case Testing**
   - Very long content (>2000 characters)
   - Special characters in content
   - Empty or null fields
   - Multiple rapid exports

### Test Database Setup

Create a test Notion database with all required properties:
- Use the exact property names from the mapping table
- Configure appropriate property types
- Test with both empty and populated databases

## Implementation Phases

### Phase 1: Core Integration (Day 1-2)
- Add @notionhq/client dependency
- Create NotionService with basic page creation
- Add Notion preferences to extension settings
- Implement basic "Send to Notion" action

### Phase 2: Data Mapping (Day 2-3)
- Implement complete 20-column mapping
- Add data transformation logic
- Handle array fields and special characters
- Test with various content types

### Phase 3: Error Handling & Polish (Day 3)
- Comprehensive error handling
- User-friendly error messages
- Connection validation
- Debug logging integration

### Phase 4: Testing & Documentation (Day 3)
- Unit and integration tests
- User documentation
- Configuration guide
- Troubleshooting documentation

## Security Considerations

1. **API Token Storage**: Store Notion API tokens securely using Raycast's preference system
2. **Data Validation**: Sanitize all user input before sending to Notion API
3. **Permission Validation**: Verify database access before attempting operations
4. **Rate Limiting**: Implement proper rate limiting to avoid API abuse
5. **Error Information**: Avoid exposing sensitive information in error messages

## Performance Considerations

1. **Async Operations**: All Notion API calls are asynchronous and non-blocking
2. **Content Truncation**: Automatically truncate large content to stay within Notion limits
3. **Batch Operations**: Consider batching multiple exports if needed in future
4. **Caching**: Cache database property information to reduce API calls
5. **Timeout Handling**: Implement reasonable timeouts for all API operations

## Future Enhancements

1. **Multiple Database Support**: Allow users to configure multiple target databases
2. **Custom Property Mapping**: Let users customize which CSV columns map to which Notion properties
3. **Template Support**: Pre-configured database templates for different use cases
4. **Bulk Export**: Export multiple extractions at once
5. **Notion Page Templates**: Use Notion page templates for consistent formatting