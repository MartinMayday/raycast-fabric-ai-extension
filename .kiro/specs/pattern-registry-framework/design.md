# Design Document

## Overview

The Pattern Registry Framework transforms the single-pattern Raycast Fabric AI extension into a scalable system supporting all 200+ Fabric patterns. Based on comprehensive analysis of the pattern library, we've identified five major pattern categories with distinct output formats:

- **Analysis Patterns** (35+): analyze_claims, analyze_paper, rate_content - produce structured analysis with ratings, evidence, and recommendations
- **Creation Patterns** (40+): create_art_prompt, create_mermaid_visualization, create_quiz - generate new content, diagrams, and structured outputs  
- **Extraction Patterns** (30+): extract_wisdom, extract_business_ideas, extract_references - pull specific information into categorized lists
- **Improvement Patterns** (15+): improve_writing, improve_prompt, humanize - enhance existing content with tracked changes
- **Specialized Patterns** (25+): export_data_as_csv, translate, solve_with_cot - perform specific transformations and utilities

The framework achieves 100x speed improvement (6-8 hours → 2-5 minutes per pattern) through template-based generation, universal data schema, and automated pattern discovery.

## Architecture

### High-Level Architecture

```
Pattern Registry Framework
├── Core Framework
│   ├── BasePattern.tsx (universal component)
│   ├── PatternRegistry.ts (pattern configurations)
│   ├── PatternDiscovery.ts (fabric --list integration)
│   └── UniversalDataSchema.ts (flexible export format)
├── Generation System
│   ├── PatternGenerator.ts (command generation)
│   ├── TemplateEngine.ts (code templates)
│   └── ValidationSystem.ts (pattern testing)
├── Export System
│   ├── UniversalExporter.ts (CSV/Notion export)
│   ├── SchemaMapper.ts (pattern-specific mapping)
│   └── DataTransformer.ts (type conversion)
└── User Interface
    ├── PatternSelector.tsx (pattern discovery UI)
    ├── CategoryBrowser.tsx (pattern categorization)
    └── SuggestionEngine.ts (intelligent recommendations)
```

### Pattern Categories and Data Structures

Based on analysis of all patterns, we've identified distinct data structures for each category:

#### Analysis Patterns
```typescript
interface AnalysisOutput {
  summary: string;
  claims?: Array<{
    claim: string;
    evidence: string[];
    rating: 'A' | 'B' | 'C' | 'D' | 'F';
    confidence: number;
  }>;
  ratings?: {
    overall: number;
    dimensions: Record<string, number>;
  };
  recommendations: string[];
  labels?: string[];
}
```

#### Creation Patterns  
```typescript
interface CreationOutput {
  primaryOutput: string; // Main generated content
  instructions?: string; // How to use the output
  metadata?: {
    format: 'mermaid' | 'latex' | 'markdown' | 'json';
    style?: string;
    parameters?: Record<string, any>;
  };
  sections?: Record<string, string>; // Named sections
}
```

#### Extraction Patterns
```typescript
interface ExtractionOutput {
  summary: string;
  extractedItems: Record<string, string[]>; // ideas, insights, quotes, etc.
  metadata: {
    itemCounts: Record<string, number>;
    categories: string[];
  };
  takeaway?: string;
}
```

## Components and Interfaces

### 1. BasePattern Component

**Purpose**: Universal component that handles all common functionality across patterns.

```typescript
interface PatternConfig {
  name: string;
  category: 'analysis' | 'creation' | 'extraction' | 'improvement' | 'specialized';
  description: string;
  icon: string;
  inputTypes: ('text' | 'url' | 'youtube' | 'clipboard')[];
  outputFormat: 'analysis' | 'creation' | 'extraction' | 'improvement' | 'specialized';
  fabricArgs: string[];
  parsing: {
    sections: string[];
    customParser?: string;
  };
  export: {
    csvColumns: string[];
    notionProperties: Record<string, string>;
  };
}

interface BasePatternProps {
  config: PatternConfig;
  searchText?: string;
  onResult?: (result: UniversalPatternOutput) => void;
}

class BasePattern extends React.Component<BasePatternProps> {
  // Handles all common functionality:
  // - Content processing (YouTube, clipboard, text)
  // - Fabric command execution
  // - Output parsing based on pattern config
  // - Export functionality (CSV/Notion)
  // - Error handling and debug logging
  // - UI rendering with pattern-specific sections
}
```

### 2. Pattern Registry System

**Purpose**: Central configuration system for all 200+ patterns.

```typescript
interface PatternRegistry {
  patterns: Record<string, PatternConfig>;
  categories: Record<string, PatternConfig[]>;
  
  // Discovery methods
  discoverPatterns(): Promise<string[]>;
  updateRegistry(): Promise<void>;
  validatePattern(name: string): Promise<boolean>;
  
  // Search and filtering
  searchPatterns(query: string): PatternConfig[];
  getPatternsByCategory(category: string): PatternConfig[];
  suggestPatterns(content: string): PatternConfig[];
}

// Example pattern configurations
const PATTERN_REGISTRY: Record<string, PatternConfig> = {
  extract_wisdom: {
    name: 'extract_wisdom',
    category: 'extraction',
    description: 'Extract surprising, insightful, and interesting information from text content',
    icon: Icon.Lightbulb,
    inputTypes: ['text', 'url', 'youtube', 'clipboard'],
    outputFormat: 'extraction',
    fabricArgs: ['--pattern', 'extract_wisdom'],
    parsing: {
      sections: ['SUMMARY', 'IDEAS', 'INSIGHTS', 'QUOTES', 'HABITS', 'FACTS', 'REFERENCES', 'ONE-SENTENCE TAKEAWAY', 'RECOMMENDATIONS']
    },
    export: {
      csvColumns: ['Date', 'Author', 'Hook', 'Source Type', 'Pattern Type', 'Summary', 'Ideas', 'Insights', 'Quotes', 'Habits', 'Facts', 'References', 'Takeaway', 'Recommendations'],
      notionProperties: {
        'Summary': 'Summary',
        'Ideas': 'Ideas',
        'Insights': 'Insights',
        // ... additional mappings
      }
    }
  },
  
  analyze_claims: {
    name: 'analyze_claims',
    category: 'analysis',
    description: 'Analyze and rate truth claims with evidence and counter-arguments',
    icon: Icon.Scale,
    inputTypes: ['text', 'url'],
    outputFormat: 'analysis',
    fabricArgs: ['--pattern', 'analyze_claims'],
    parsing: {
      sections: ['ARGUMENT SUMMARY', 'TRUTH CLAIMS', 'OVERALL SCORE', 'OVERALL ANALYSIS']
    },
    export: {
      csvColumns: ['Date', 'Source', 'Argument Summary', 'Claims', 'Evidence Support', 'Evidence Against', 'Ratings', 'Overall Score', 'Analysis'],
      notionProperties: {
        'Argument Summary': 'Summary',
        'Claims': 'Claims',
        'Overall Score': 'Rating'
      }
    }
  },
  
  create_art_prompt: {
    name: 'create_art_prompt',
    category: 'creation',
    description: 'Generate detailed visual art prompts for AI image generation',
    icon: Icon.Brush,
    inputTypes: ['text'],
    outputFormat: 'creation',
    fabricArgs: ['--pattern', 'create_art_prompt'],
    parsing: {
      sections: ['CONCEPT', 'VISUAL DESCRIPTION', 'AI INSTRUCTIONS', 'STYLE REFERENCES']
    },
    export: {
      csvColumns: ['Date', 'Input Concept', 'Visual Description', 'AI Instructions', 'Style References', 'Generated Prompt'],
      notionProperties: {
        'Visual Description': 'Description',
        'AI Instructions': 'Instructions',
        'Generated Prompt': 'Output'
      }
    }
  }
};
```

### 3. Universal Data Schema

**Purpose**: Flexible schema that accommodates all pattern output formats.

```typescript
interface UniversalPatternOutput {
  // Core metadata
  timestamp: Date;
  patternName: string;
  patternCategory: string;
  sourceType: 'text' | 'youtube' | 'url' | 'clipboard';
  originalInput: string;
  
  // Universal fields
  summary?: string;
  primaryOutput: string; // Raw fabric output
  
  // Structured data (varies by pattern)
  sections: Record<string, string | string[]>;
  
  // Analysis-specific fields
  ratings?: Record<string, number | string>;
  claims?: Array<{
    text: string;
    evidence: string[];
    rating: string;
  }>;
  
  // Creation-specific fields
  generatedContent?: string;
  instructions?: string;
  format?: string;
  
  // Extraction-specific fields
  extractedItems?: Record<string, string[]>;
  
  // Export metadata
  exportColumns: Record<string, any>;
  notionProperties: Record<string, any>;
}
```

### 4. Pattern Generation System

**Purpose**: Automatically generate Raycast commands from pattern configurations.

```typescript
class PatternGenerator {
  generateCommand(config: PatternConfig): string {
    return `
import React from "react";
import { BasePattern } from "../components/BasePattern";
import { PATTERN_REGISTRY } from "../constants/PatternRegistry";

export default function ${this.toPascalCase(config.name)}() {
  return <BasePattern config={PATTERN_REGISTRY.${config.name}} />;
}
    `;
  }
  
  generatePackageJsonEntry(config: PatternConfig): object {
    return {
      name: config.name.replace(/_/g, '-'),
      title: this.toTitleCase(config.name),
      description: config.description,
      mode: "view",
      icon: config.icon
    };
  }
  
  async generateAllPatterns(): Promise<void> {
    const patterns = await this.discoverPatterns();
    
    for (const patternName of patterns) {
      const config = this.createPatternConfig(patternName);
      const commandCode = this.generateCommand(config);
      const packageEntry = this.generatePackageJsonEntry(config);
      
      await this.writeCommandFile(patternName, commandCode);
      await this.updatePackageJson(patternName, packageEntry);
    }
  }
}
```

## Data Models

### Universal Export Schema

Based on analysis of all 200+ patterns, we need a flexible schema that can accommodate:

| Column Category | Purpose | Example Columns |
|----------------|---------|-----------------|
| **Core Metadata** | Universal fields | Date, Pattern Name, Pattern Category, Source Type, Original Input |
| **Content Fields** | Main outputs | Summary, Primary Output, Generated Content, Instructions |
| **Structured Data** | Lists and arrays | Ideas, Insights, Quotes, Claims, Evidence, Recommendations |
| **Analysis Fields** | Ratings and scores | Overall Rating, Claim Ratings, Quality Score, Confidence Level |
| **Creation Fields** | Generated content | Visual Description, AI Instructions, Style References, Format Type |
| **Extraction Fields** | Categorized items | Facts, References, Habits, Predictions, Business Ideas |
| **Improvement Fields** | Change tracking | Original Text, Improved Text, Changes Made, Improvement Type |
| **Specialized Fields** | Pattern-specific | CSV Data, Translation, Mathematical Solution, Code Output |

### Dynamic Column Mapping

```typescript
interface ColumnMapping {
  // Universal columns (always present)
  universal: {
    date: string;
    patternName: string;
    patternCategory: string;
    sourceType: string;
    originalInput: string;
    summary: string;
    primaryOutput: string;
  };
  
  // Category-specific columns
  analysis?: {
    claims: string;
    evidence: string;
    ratings: string;
    overallScore: string;
    analysis: string;
  };
  
  creation?: {
    generatedContent: string;
    instructions: string;
    format: string;
    styleReferences: string;
  };
  
  extraction?: {
    ideas: string;
    insights: string;
    quotes: string;
    facts: string;
    references: string;
    takeaway: string;
    recommendations: string;
  };
  
  // Pattern-specific columns (dynamic)
  custom: Record<string, string>;
}
```

## Error Handling

### Pattern-Specific Error Handling

```typescript
class PatternErrorHandler {
  static handlePatternError(patternName: string, error: Error): UserFriendlyError {
    const patternConfig = PATTERN_REGISTRY[patternName];
    
    switch (patternConfig.category) {
      case 'analysis':
        return this.handleAnalysisError(error);
      case 'creation':
        return this.handleCreationError(error);
      case 'extraction':
        return this.handleExtractionError(error);
      default:
        return this.handleGenericError(error);
    }
  }
  
  static validatePatternOutput(patternName: string, output: string): boolean {
    const config = PATTERN_REGISTRY[patternName];
    const requiredSections = config.parsing.sections;
    
    return requiredSections.every(section => 
      output.includes(`# ${section}`) || output.includes(`## ${section}`)
    );
  }
}
```

## Testing Strategy

### Automated Pattern Testing

```typescript
class PatternTestSuite {
  async testAllPatterns(): Promise<TestResults> {
    const results: TestResults = {};
    
    for (const [name, config] of Object.entries(PATTERN_REGISTRY)) {
      results[name] = await this.testPattern(name, config);
    }
    
    return results;
  }
  
  async testPattern(name: string, config: PatternConfig): Promise<PatternTestResult> {
    const testCases = this.getTestCases(config.category);
    const results: PatternTestResult = {
      name,
      passed: 0,
      failed: 0,
      errors: []
    };
    
    for (const testCase of testCases) {
      try {
        const output = await this.runFabricCommand(name, testCase.input);
        const isValid = this.validateOutput(config, output);
        
        if (isValid) {
          results.passed++;
        } else {
          results.failed++;
          results.errors.push(`Invalid output format for input: ${testCase.input}`);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Execution failed: ${error.message}`);
      }
    }
    
    return results;
  }
}
```

## Implementation Phases

### Phase 1: Core Framework (Week 1)
- Extract BasePattern component from extract-wisdom-ultimate.tsx
- Create PatternRegistry with initial 10 popular patterns
- Implement universal data schema and export system
- Test framework with diverse pattern types

### Phase 2: Pattern Discovery & Generation (Week 2)
- Implement fabric --list integration
- Create pattern generation system
- Build template engine for command generation
- Generate first 50 patterns automatically

### Phase 3: Advanced Features (Week 3)
- Add pattern suggestion engine using suggest_pattern
- Implement category-based browsing
- Create pattern validation and testing system
- Add intelligent content preprocessing

### Phase 4: Full Scale Deployment (Week 4)
- Generate all 200+ patterns
- Comprehensive testing across all categories
- Performance optimization
- Documentation and user guides

## Usage Analytics System

### Data Collection Strategy

```typescript
interface UsageEvent {
  id: string;
  timestamp: Date;
  eventType: 'pattern_execution' | 'pattern_chain' | 'export' | 'error';
  patternName: string;
  patternCategory: string;
  sourceType: 'text' | 'youtube' | 'url' | 'clipboard';
  inputHash: string; // SHA-256 hash of input for deduplication
  success: boolean;
  executionTime: number;
  outputSize: number;
  userId: string; // Anonymous user identifier
}

interface UsageMetrics {
  // Pattern popularity
  patternUsageCount: Record<string, number>;
  patternSuccessRate: Record<string, number>;
  
  // Content type preferences
  sourceTypeDistribution: Record<string, number>;
  
  // User behavior patterns
  commonPatternSequences: Array<{
    sequence: string[];
    frequency: number;
  }>;
  
  // Performance metrics
  averageExecutionTime: Record<string, number>;
  errorRates: Record<string, number>;
}
```

### Usage Counting Logic

**Smart Deduplication Strategy**:
- **Same URL + Same Pattern**: Counts as **1 unique use** (no duplicates)
- **Same URL + Different Pattern**: Counts as **separate uses** (different analysis)
- **Different URL + Same Pattern**: Counts as **separate uses** (different content)
- **Same URL + Same Pattern Chain**: Counts as **1 unique chain use** (same deduplication logic)
- **Same URL + Different Pattern Chain**: Counts as **separate uses** (different chain analysis)
- **Different URL + Same Pattern Chain**: Counts as **separate uses** (different content)

**Multi-Level Counters**:
```typescript
interface PatternUsageStats {
  // Core metrics (deduplicated)
  uniqueUses: number;           // Distinct input+pattern combinations
  totalExecutions: number;      // All runs (including re-runs for debugging)
  
  // Success metrics
  successfulUses: number;       // Only successful completions
  failedAttempts: number;       // Failed executions
  
  // User engagement
  activeUsers: number;          // Distinct users who used this pattern
  averageUsesPerUser: number;   // Engagement depth
}
```

**Hash-Based Deduplication**:
- Create hash: `SHA-256(inputContent + patternName + userId)`
- Track in database: `unique_pattern_uses` table
- Only increment `uniqueUses` for new hashes
- Always increment `totalExecutions` for performance tracking

### Data Storage Locations

1. **Local Analytics DB** (Primary)
   - **Location**: `${environment.supportPath}/analytics/usage.db`
   - **Format**: SQLite database for efficient querying
   - **Retention**: 1 year of detailed data, lifetime aggregates
   - **Privacy**: All data stays local, no external transmission

2. **CSV Export Integration** (Secondary)
   - **Location**: Existing `fabric-extractions.csv`
   - **Purpose**: Backup analytics data in human-readable format
   - **Contains**: Pattern usage embedded in export data

3. **Memory Cache** (Performance)
   - **Location**: In-memory during session
   - **Purpose**: Fast access to recent usage patterns
   - **Scope**: Current session only

### Analytics Implementation

```typescript
class UsageAnalytics {
  private db: SQLiteDatabase;
  private cache: Map<string, UsageMetrics>;
  
  // Smart usage recording with deduplication
  async recordPatternUsage(event: UsageEvent): Promise<void> {
    const usageHash = this.createUsageHash(event.inputHash, event.patternName, event.userId);
    const isUniqueUse = await this.isNewUniqueUse(usageHash);
    
    // Always record execution for performance tracking
    await this.recordExecution(event);
    
    // Only increment unique use counter for new combinations
    if (isUniqueUse) {
      await this.recordUniqueUse(event, usageHash);
    }
  }
  
  async recordPatternChain(patterns: string[], input: string, userId: string): Promise<void> {
    // Apply same deduplication logic to chains
    const inputHash = this.createInputHash(input);
    const chainHash = this.createChainHash(patterns, inputHash, userId);
    const isUniqueChainUse = await this.isNewUniqueChainUse(chainHash);
    
    // Always record execution for performance tracking
    await this.recordChainExecution(patterns, input);
    
    // Only increment unique use counter for new chain combinations
    if (isUniqueChainUse) {
      await this.recordUniqueChainUse(chainHash, patterns);
    }
  }
  
  // Query analytics with accurate statistics
  async getPopularPatterns(timeframe: 'day' | 'week' | 'month' | 'all'): Promise<PatternRanking[]> {
    // Returns patterns ranked by uniqueUses, not totalExecutions
    return this.queryUniquePatternUsage(timeframe);
  }
  
  async getPatternSuccessRates(): Promise<Record<string, number>> {
    // successfulUses / uniqueUses (not totalExecutions)
    return this.calculateSuccessRates();
  }
  
  // Deduplication helpers
  private createUsageHash(inputHash: string, patternName: string, userId: string): string {
    return SHA256(`${inputHash}:${patternName}:${userId}`);
  }
  
  private createChainHash(patterns: string[], inputHash: string, userId: string): string {
    const chainSignature = patterns.join('→');
    return SHA256(`${inputHash}:CHAIN[${chainSignature}]:${userId}`);
  }
  
  private async isNewUniqueUse(usageHash: string): Promise<boolean> {
    return !(await this.db.exists('unique_pattern_uses', { hash: usageHash }));
  }
  
  private async isNewUniqueChainUse(chainHash: string): Promise<boolean> {
    return !(await this.db.exists('unique_chain_uses', { hash: chainHash }));
  }
}
```

## Performance Considerations

### Pattern Loading Strategy
- **Lazy Loading**: Load pattern configurations on-demand
- **Caching**: Cache frequently used patterns in memory based on analytics
- **Batch Generation**: Generate multiple patterns in parallel
- **Incremental Updates**: Only regenerate changed patterns
- **Analytics-Driven Optimization**: Preload most popular patterns

### Memory Management
- **Pattern Registry**: Load configurations lazily, prioritize popular patterns
- **Output Caching**: Cache recent pattern outputs, especially for repeated inputs
- **Resource Cleanup**: Proper cleanup of fabric processes
- **Memory Limits**: Monitor and limit memory usage per pattern
- **Analytics Storage**: Efficient SQLite storage with automatic cleanup

## Security Considerations

### Pattern Validation
- **Input Sanitization**: Validate all user inputs before processing
- **Command Injection Prevention**: Sanitize fabric command arguments
- **Output Validation**: Verify pattern outputs match expected formats
- **Resource Limits**: Prevent resource exhaustion attacks

### Data Privacy
- **Local Processing**: All pattern execution happens locally
- **No Data Transmission**: Pattern outputs stay on user's machine
- **Secure Storage**: Encrypt sensitive pattern configurations
- **User Consent**: Clear disclosure of data processing

## Future Enhancements

### Advanced Pattern Features
1. **Pattern Chaining (Priority)**: Chain 1-5 patterns together in sequence
   - Pre-built chains: Content Analysis, Creative Workflow, Academic Research, Business Analysis
   - Custom chain builder with drag-and-drop interface
   - Chain templates for common workflows
   - Single export containing all chain results
2. **Custom Pattern Creation**: Allow users to create their own patterns
3. **Conditional Logic**: Add if/then logic to pattern execution
4. **Pattern Versioning**: Support multiple versions of patterns
5. **Collaborative Patterns**: Share patterns and chains with team members

### AI-Powered Enhancements
1. **Smart Pattern Selection**: AI-powered pattern recommendations
2. **Content Optimization**: Automatically optimize input for patterns
3. **Output Enhancement**: Post-process pattern outputs for better quality
4. **Pattern Learning**: Learn from user preferences and usage patterns
5. **Predictive Caching**: Pre-load likely-to-be-used patterns

### Integration Expansions
1. **Multiple Export Formats**: Support for more export destinations
2. **API Integration**: Connect with external services and APIs
3. **Workflow Automation**: Integrate with workflow tools
4. **Real-time Collaboration**: Multi-user pattern execution
5. **Cloud Synchronization**: Sync patterns across devices
## U
sage Analytics Summary

### **Corrected Usage Counting Rules** ✅
- **Same URL + Same Pattern (repeated)**: **1 unique use** (prevents duplicate inflation)
- **Same URL + Different Pattern**: **Separate unique uses** (different analysis types)  
- **Different URL + Same Pattern**: **Separate unique uses** (different content)
- **Same URL + Same Pattern Chain (repeated)**: **1 unique chain use** (same deduplication logic)
- **Same URL + Different Pattern Chain**: **Separate unique uses** (different chain analysis)
- **Different URL + Same Pattern Chain**: **Separate unique uses** (different content)
- **Debug Re-runs**: Tracked as `totalExecutions` but don't inflate `uniqueUses`

### **Why This Matters**
- **Accurate Statistics**: Pattern popularity based on genuine unique usage
- **Reliable Suggestions**: AI recommendations based on real user behavior patterns
- **Performance Tracking**: Separate metrics for debugging and optimization
- **User Privacy**: All analytics stored locally, no external data transmission

This ensures the pattern suggestion engine provides meaningful recommendations based on actual usage patterns, not inflated statistics from repeated debugging sessions!