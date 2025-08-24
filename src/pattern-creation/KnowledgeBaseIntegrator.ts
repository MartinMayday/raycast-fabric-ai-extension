/**
 * KnowledgeBaseIntegrator - Creates searchable database of pattern creation best practices
 * 
 * This class provides functionality to:
 * - Create searchable database of pattern creation best practices
 * - Implement template and approach preservation system
 * - Build knowledge base search and retrieval functionality
 * - Maintain pattern creation knowledge and expertise
 */

export interface KnowledgeBaseEntry {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  content: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'best_practice' | 'template' | 'example' | 'troubleshooting' | 'guide';
  metadata: KnowledgeMetadata;
  relatedEntries: string[];
  searchKeywords: string[];
}

export interface KnowledgeMetadata {
  author: string;
  created: string;
  updated: string;
  version: string;
  quality: number;
  usage: number;
  rating: number;
  source: string;
}

export interface SearchQuery {
  query: string;
  category?: string;
  type?: string;
  difficulty?: string;
  tags?: string[];
  limit?: number;
  sortBy?: 'relevance' | 'quality' | 'usage' | 'rating' | 'date';
}

export interface SearchResult {
  entry: KnowledgeBaseEntry;
  score: number;
  matchedFields: string[];
  snippet: string;
}

export interface KnowledgeBase {
  entries: Record<string, KnowledgeBaseEntry>;
  categories: Record<string, CategoryInfo>;
  tags: Record<string, TagInfo>;
  templates: Record<string, TemplateInfo>;
  statistics: KnowledgeBaseStats;
}

export interface CategoryInfo {
  name: string;
  description: string;
  entryCount: number;
  subcategories: string[];
}

export interface TagInfo {
  name: string;
  count: number;
  relatedTags: string[];
}

export interface TemplateInfo {
  name: string;
  description: string;
  template: string;
  variables: string[];
  usage: number;
}

export interface KnowledgeBaseStats {
  totalEntries: number;
  totalCategories: number;
  totalTags: number;
  totalTemplates: number;
  lastUpdated: string;
  qualityDistribution: Record<string, number>;
}

export class KnowledgeBaseIntegrator {
  private knowledgeBase: KnowledgeBase;
  
  private readonly PATTERN_CREATION_CATEGORIES = {
    'Pattern Structure': 'Guidelines for pattern file structure and organization',
    'Content Analysis': 'Best practices for analyzing and extracting content insights',
    'Scoring Systems': 'Approaches for implementing effective scoring and rating systems',
    'Output Formatting': 'Standards for structuring and presenting pattern outputs',
    'Testing & Validation': 'Methods for testing and validating pattern effectiveness',
    'Integration': 'Techniques for integrating patterns with existing systems',
    'Documentation': 'Best practices for documenting patterns and usage',
    'Performance': 'Optimization techniques for pattern execution and efficiency'
  };

  private readonly BEST_PRACTICES_DATABASE = [
    {
      title: 'Use Clear and Specific Pattern Identity',
      category: 'Pattern Structure',
      content: 'Define a clear, specific identity for your pattern that explains exactly what expertise it provides and what analysis it performs.',
      tags: ['identity', 'purpose', 'clarity'],
      difficulty: 'beginner',
      type: 'best_practice'
    },
    {
      title: 'Implement Comprehensive Scoring Systems',
      category: 'Scoring Systems',
      content: 'Use 1-10 scoring for individual sections and 0-100 for overall assessments. Provide clear criteria and interpretation guidelines.',
      tags: ['scoring', 'assessment', 'evaluation'],
      difficulty: 'intermediate',
      type: 'best_practice'
    },
    {
      title: 'Structure Output with Clear Sections',
      category: 'Output Formatting',
      content: 'Organize output into clearly defined sections with descriptive names, specific analysis, and actionable recommendations.',
      tags: ['output', 'structure', 'organization'],
      difficulty: 'beginner',
      type: 'best_practice'
    },
    {
      title: 'Prioritize Recommendations Effectively',
      category: 'Output Formatting',
      content: 'Use HIGH/MEDIUM/LOW prioritization to help users focus on the most impactful improvements first.',
      tags: ['prioritization', 'recommendations', 'impact'],
      difficulty: 'intermediate',
      type: 'best_practice'
    },
    {
      title: 'Create Diverse Sample Inputs',
      category: 'Testing & Validation',
      content: 'Develop at least 5 diverse sample inputs covering different scenarios, industries, and complexity levels.',
      tags: ['samples', 'testing', 'validation'],
      difficulty: 'intermediate',
      type: 'best_practice'
    }
  ];

  constructor() {
    this.knowledgeBase = this.initializeKnowledgeBase();
  }

  /**
   * Initialize knowledge base with default entries
   */
  private initializeKnowledgeBase(): KnowledgeBase {
    const entries: Record<string, KnowledgeBaseEntry> = {};
    const categories: Record<string, CategoryInfo> = {};
    const tags: Record<string, TagInfo> = {};
    const templates: Record<string, TemplateInfo> = {};

    // Initialize categories
    Object.entries(this.PATTERN_CREATION_CATEGORIES).forEach(([name, description]) => {
      categories[name] = {
        name,
        description,
        entryCount: 0,
        subcategories: []
      };
    });

    // Add best practices entries
    this.BEST_PRACTICES_DATABASE.forEach((practice, index) => {
      const entry = this.createKnowledgeBaseEntry(
        `bp_${index + 1}`,
        practice.title,
        practice.category,
        practice.content,
        practice.tags,
        practice.difficulty,
        practice.type
      );
      
      entries[entry.id] = entry;
      categories[practice.category].entryCount++;
      
      // Update tag counts
      practice.tags.forEach(tag => {
        if (!tags[tag]) {
          tags[tag] = { name: tag, count: 0, relatedTags: [] };
        }
        tags[tag].count++;
      });
    });

    return {
      entries,
      categories,
      tags,
      templates,
      statistics: this.calculateStatistics(entries, categories, tags, templates)
    };
  }  /**

   * Create a knowledge base entry
   */
  private createKnowledgeBaseEntry(
    id: string,
    title: string,
    category: string,
    content: string,
    tags: string[],
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    type: 'best_practice' | 'template' | 'example' | 'troubleshooting' | 'guide'
  ): KnowledgeBaseEntry {
    return {
      id,
      title,
      category,
      subcategory: '',
      content,
      tags,
      difficulty,
      type,
      metadata: {
        author: 'Pattern Creation System',
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        version: '1.0.0',
        quality: 8,
        usage: 0,
        rating: 8,
        source: 'built-in'
      },
      relatedEntries: [],
      searchKeywords: this.generateSearchKeywords(title, content, tags)
    };
  }

  /**
   * Generate search keywords from title, content, and tags
   */
  private generateSearchKeywords(title: string, content: string, tags: string[]): string[] {
    const keywords = new Set<string>();
    
    // Add title words
    title.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 2) keywords.add(word);
    });
    
    // Add content words
    content.toLowerCase().split(/\s+/).forEach(word => {
      if (word.length > 3) keywords.add(word);
    });
    
    // Add tags
    tags.forEach(tag => keywords.add(tag.toLowerCase()));
    
    return Array.from(keywords);
  }

  /**
   * Calculate knowledge base statistics
   */
  private calculateStatistics(
    entries: Record<string, KnowledgeBaseEntry>,
    categories: Record<string, CategoryInfo>,
    tags: Record<string, TagInfo>,
    templates: Record<string, TemplateInfo>
  ): KnowledgeBaseStats {
    const qualityDistribution: Record<string, number> = {
      'excellent': 0,
      'good': 0,
      'average': 0,
      'poor': 0
    };

    Object.values(entries).forEach(entry => {
      const quality = entry.metadata.quality;
      if (quality >= 9) qualityDistribution.excellent++;
      else if (quality >= 7) qualityDistribution.good++;
      else if (quality >= 5) qualityDistribution.average++;
      else qualityDistribution.poor++;
    });

    return {
      totalEntries: Object.keys(entries).length,
      totalCategories: Object.keys(categories).length,
      totalTags: Object.keys(tags).length,
      totalTemplates: Object.keys(templates).length,
      lastUpdated: new Date().toISOString(),
      qualityDistribution
    };
  }

  /**
   * Search knowledge base entries
   */
  searchKnowledgeBase(query: SearchQuery): SearchResult[] {
    const results: SearchResult[] = [];
    const searchTerms = query.query.toLowerCase().split(/\s+/);

    Object.values(this.knowledgeBase.entries).forEach(entry => {
      // Apply filters
      if (query.category && entry.category !== query.category) return;
      if (query.type && entry.type !== query.type) return;
      if (query.difficulty && entry.difficulty !== query.difficulty) return;
      if (query.tags && !query.tags.some(tag => entry.tags.includes(tag))) return;

      // Calculate relevance score
      const score = this.calculateRelevanceScore(entry, searchTerms);
      if (score > 0) {
        const matchedFields = this.getMatchedFields(entry, searchTerms);
        const snippet = this.generateSnippet(entry.content, searchTerms);
        
        results.push({
          entry,
          score,
          matchedFields,
          snippet
        });
      }
    });

    // Sort results
    const sortBy = query.sortBy || 'relevance';
    results.sort((a, b) => {
      switch (sortBy) {
        case 'quality': return b.entry.metadata.quality - a.entry.metadata.quality;
        case 'usage': return b.entry.metadata.usage - a.entry.metadata.usage;
        case 'rating': return b.entry.metadata.rating - a.entry.metadata.rating;
        case 'date': return new Date(b.entry.metadata.updated).getTime() - new Date(a.entry.metadata.updated).getTime();
        default: return b.score - a.score;
      }
    });

    // Apply limit
    const limit = query.limit || 10;
    return results.slice(0, limit);
  }

  /**
   * Calculate relevance score for search
   */
  private calculateRelevanceScore(entry: KnowledgeBaseEntry, searchTerms: string[]): number {
    let score = 0;
    const titleWords = entry.title.toLowerCase().split(/\s+/);
    const contentWords = entry.content.toLowerCase().split(/\s+/);
    const keywords = entry.searchKeywords;

    searchTerms.forEach(term => {
      // Title matches (highest weight)
      if (titleWords.some(word => word.includes(term))) {
        score += 10;
      }
      
      // Tag matches (high weight)
      if (entry.tags.some(tag => tag.toLowerCase().includes(term))) {
        score += 8;
      }
      
      // Keyword matches (medium weight)
      if (keywords.some(keyword => keyword.includes(term))) {
        score += 5;
      }
      
      // Content matches (lower weight)
      if (contentWords.some(word => word.includes(term))) {
        score += 2;
      }
    });

    // Boost score based on quality and usage
    score *= (entry.metadata.quality / 10);
    score += Math.log(entry.metadata.usage + 1);

    return score;
  }

  /**
   * Get matched fields for highlighting
   */
  private getMatchedFields(entry: KnowledgeBaseEntry, searchTerms: string[]): string[] {
    const matchedFields: string[] = [];
    
    searchTerms.forEach(term => {
      if (entry.title.toLowerCase().includes(term)) {
        matchedFields.push('title');
      }
      if (entry.content.toLowerCase().includes(term)) {
        matchedFields.push('content');
      }
      if (entry.tags.some(tag => tag.toLowerCase().includes(term))) {
        matchedFields.push('tags');
      }
    });

    return [...new Set(matchedFields)];
  }

  /**
   * Generate content snippet for search results
   */
  private generateSnippet(content: string, searchTerms: string[]): string {
    const sentences = content.split(/[.!?]+/);
    let bestSentence = sentences[0];
    let maxMatches = 0;

    sentences.forEach(sentence => {
      const matches = searchTerms.filter(term => 
        sentence.toLowerCase().includes(term)
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestSentence = sentence;
      }
    });

    return bestSentence.trim().substring(0, 200) + (bestSentence.length > 200 ? '...' : '');
  }

  /**
   * Add new entry to knowledge base
   */
  addKnowledgeBaseEntry(
    title: string,
    category: string,
    content: string,
    tags: string[],
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    type: 'best_practice' | 'template' | 'example' | 'troubleshooting' | 'guide'
  ): string {
    const id = `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const entry = this.createKnowledgeBaseEntry(id, title, category, content, tags, difficulty, type);
    
    this.knowledgeBase.entries[id] = entry;
    
    // Update category count
    if (this.knowledgeBase.categories[category]) {
      this.knowledgeBase.categories[category].entryCount++;
    }
    
    // Update tag counts
    tags.forEach(tag => {
      if (!this.knowledgeBase.tags[tag]) {
        this.knowledgeBase.tags[tag] = { name: tag, count: 0, relatedTags: [] };
      }
      this.knowledgeBase.tags[tag].count++;
    });
    
    // Update statistics
    this.knowledgeBase.statistics = this.calculateStatistics(
      this.knowledgeBase.entries,
      this.knowledgeBase.categories,
      this.knowledgeBase.tags,
      this.knowledgeBase.templates
    );
    
    return id;
  }

  /**
   * Get entry by ID
   */
  getEntry(id: string): KnowledgeBaseEntry | null {
    return this.knowledgeBase.entries[id] || null;
  }

  /**
   * Get entries by category
   */
  getEntriesByCategory(category: string): KnowledgeBaseEntry[] {
    return Object.values(this.knowledgeBase.entries)
      .filter(entry => entry.category === category);
  }

  /**
   * Get entries by tag
   */
  getEntriesByTag(tag: string): KnowledgeBaseEntry[] {
    return Object.values(this.knowledgeBase.entries)
      .filter(entry => entry.tags.includes(tag));
  }

  /**
   * Get related entries
   */
  getRelatedEntries(entryId: string, limit: number = 5): KnowledgeBaseEntry[] {
    const entry = this.getEntry(entryId);
    if (!entry) return [];

    const related: { entry: KnowledgeBaseEntry; score: number }[] = [];
    
    Object.values(this.knowledgeBase.entries).forEach(otherEntry => {
      if (otherEntry.id === entryId) return;
      
      let score = 0;
      
      // Same category bonus
      if (otherEntry.category === entry.category) score += 5;
      
      // Shared tags bonus
      const sharedTags = entry.tags.filter(tag => otherEntry.tags.includes(tag));
      score += sharedTags.length * 3;
      
      // Similar difficulty bonus
      if (otherEntry.difficulty === entry.difficulty) score += 2;
      
      // Same type bonus
      if (otherEntry.type === entry.type) score += 1;
      
      if (score > 0) {
        related.push({ entry: otherEntry, score });
      }
    });
    
    return related
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.entry);
  }

  /**
   * Get knowledge base statistics
   */
  getStatistics(): KnowledgeBaseStats {
    return this.knowledgeBase.statistics;
  }

  /**
   * Get all categories
   */
  getCategories(): Record<string, CategoryInfo> {
    return this.knowledgeBase.categories;
  }

  /**
   * Get all tags
   */
  getTags(): Record<string, TagInfo> {
    return this.knowledgeBase.tags;
  }

  /**
   * Get popular entries
   */
  getPopularEntries(limit: number = 10): KnowledgeBaseEntry[] {
    return Object.values(this.knowledgeBase.entries)
      .sort((a, b) => b.metadata.usage - a.metadata.usage)
      .slice(0, limit);
  }

  /**
   * Get high-quality entries
   */
  getHighQualityEntries(limit: number = 10): KnowledgeBaseEntry[] {
    return Object.values(this.knowledgeBase.entries)
      .filter(entry => entry.metadata.quality >= 8)
      .sort((a, b) => b.metadata.quality - a.metadata.quality)
      .slice(0, limit);
  }

  /**
   * Extract knowledge from pattern creation process
   */
  extractPatternKnowledge(
    patternName: string,
    patternContent: string,
    patternMetadata: any,
    creationProcess: any
  ): void {
    // Extract best practices from successful pattern creation
    if (patternMetadata.quality >= 8) {
      this.extractBestPracticesFromPattern(patternName, patternContent, patternMetadata);
    }
    
    // Extract templates from pattern structure
    this.extractTemplatesFromPattern(patternName, patternContent);
    
    // Extract troubleshooting information from creation issues
    if (creationProcess.issues && creationProcess.issues.length > 0) {
      this.extractTroubleshootingFromProcess(patternName, creationProcess.issues);
    }
  }

  /**
   * Extract best practices from successful pattern
   */
  private extractBestPracticesFromPattern(
    patternName: string,
    patternContent: string,
    patternMetadata: any
  ): void {
    const practices: Array<{
      title: string;
      category: string;
      content: string;
      tags: string[];
    }> = [];

    // Analyze pattern structure
    if (patternContent.includes('# IDENTITY and PURPOSE')) {
      practices.push({
        title: 'Clear Pattern Identity Definition',
        category: 'Pattern Structure',
        content: `Pattern ${patternName} demonstrates clear identity definition with specific purpose and role description.`,
        tags: ['identity', 'purpose', 'structure']
      });
    }

    // Analyze scoring implementation
    if (patternContent.includes('1-10') && patternContent.includes('0-100')) {
      practices.push({
        title: 'Dual Scoring System Implementation',
        category: 'Scoring Systems',
        content: `Pattern ${patternName} uses both section-level (1-10) and overall (0-100) scoring for comprehensive assessment.`,
        tags: ['scoring', 'assessment', 'evaluation']
      });
    }

    // Analyze output structure
    const outputSections = (patternContent.match(/- [A-Z][A-Z\s/&]+:/g) || []).length;
    if (outputSections >= 5) {
      practices.push({
        title: 'Comprehensive Output Structure',
        category: 'Output Formatting',
        content: `Pattern ${patternName} provides ${outputSections} detailed output sections for thorough analysis.`,
        tags: ['output', 'structure', 'comprehensive']
      });
    }

    // Add practices to knowledge base
    practices.forEach(practice => {
      this.addKnowledgeBaseEntry(
        practice.title,
        practice.category,
        practice.content,
        practice.tags,
        'intermediate',
        'best_practice'
      );
    });
  }

  /**
   * Extract templates from pattern structure
   */
  private extractTemplatesFromPattern(patternName: string, patternContent: string): void {
    // Extract identity template
    const identityMatch = patternContent.match(/# IDENTITY and PURPOSE\s*\n\n([^#]+)/);
    if (identityMatch) {
      const template = identityMatch[1].trim();
      this.addTemplate(
        `${patternName}_identity`,
        'Pattern Identity Template',
        template,
        ['role', 'expertise', 'purpose']
      );
    }

    // Extract output template
    const outputMatch = patternContent.match(/# OUTPUT\s*\n\n([\s\S]*?)(?=\n# |$)/);
    if (outputMatch) {
      const template = outputMatch[1].trim();
      this.addTemplate(
        `${patternName}_output`,
        'Output Structure Template',
        template,
        ['sections', 'scoring', 'format']
      );
    }
  }

  /**
   * Extract troubleshooting from creation process
   */
  private extractTroubleshootingFromProcess(patternName: string, issues: any[]): void {
    // This would analyze common issues and create troubleshooting entries
    // Implementation would depend on the structure of the issues data
  }

  /**
   * Add template to knowledge base
   */
  addTemplate(id: string, name: string, template: string, variables: string[]): void {
    this.knowledgeBase.templates[id] = {
      name,
      description: `Template extracted from pattern creation process`,
      template,
      variables,
      usage: 0
    };
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): TemplateInfo | null {
    return this.knowledgeBase.templates[id] || null;
  }

  /**
   * Search templates
   */
  searchTemplates(query: string): TemplateInfo[] {
    const searchTerms = query.toLowerCase().split(/\s+/);
    const results: { template: TemplateInfo; score: number }[] = [];

    Object.values(this.knowledgeBase.templates).forEach(template => {
      let score = 0;
      
      searchTerms.forEach(term => {
        if (template.name.toLowerCase().includes(term)) score += 5;
        if (template.description.toLowerCase().includes(term)) score += 3;
        if (template.variables.some(v => v.toLowerCase().includes(term))) score += 2;
      });
      
      if (score > 0) {
        results.push({ template, score });
      }
    });

    return results
      .sort((a, b) => b.score - a.score)
      .map(item => item.template);
  }

  /**
   * Get recommendations for pattern creation
   */
  getPatternCreationRecommendations(context: {
    category?: string;
    difficulty?: string;
    hasScoring?: boolean;
    hasPrioritization?: boolean;
  }): KnowledgeBaseEntry[] {
    const recommendations: KnowledgeBaseEntry[] = [];
    
    // Get relevant best practices
    const bestPractices = Object.values(this.knowledgeBase.entries)
      .filter(entry => entry.type === 'best_practice');
    
    // Filter by context
    bestPractices.forEach(practice => {
      let relevant = true;
      
      if (context.category && !practice.tags.includes(context.category.toLowerCase())) {
        relevant = false;
      }
      
      if (context.hasScoring && !practice.tags.includes('scoring')) {
        // Don't exclude, but lower priority
      }
      
      if (relevant) {
        recommendations.push(practice);
      }
    });
    
    return recommendations
      .sort((a, b) => b.metadata.quality - a.metadata.quality)
      .slice(0, 10);
  }

  /**
   * Export knowledge base
   */
  exportKnowledgeBase(): KnowledgeBase {
    return JSON.parse(JSON.stringify(this.knowledgeBase));
  }

  /**
   * Import knowledge base
   */
  importKnowledgeBase(knowledgeBase: KnowledgeBase): void {
    this.knowledgeBase = knowledgeBase;
  }
}