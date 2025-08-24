/**
 * RegistryIntegrator - Handles automatic pattern registration with metadata generation
 * 
 * This class provides functionality to:
 * - Generate pattern metadata for registry compatibility
 * - Determine appropriate categories and icons for patterns
 * - Create command files for new patterns
 * - Integrate patterns with the existing registry system
 */

export interface PatternMetadata {
  name: string;
  displayName: string;
  description: string;
  category: string;
  icon: string;
  tags: string[];
  version: string;
  author: string;
  created: string;
  updated: string;
  outputSections: string[];
  scoringSystem: boolean;
  prioritization: boolean;
  sampleCount: number;
}

export interface RegistryConfiguration {
  patterns: Record<string, PatternMetadata>;
  categories: Record<string, CategoryConfig>;
  commands: Record<string, CommandConfig>;
}

export interface CategoryConfig {
  name: string;
  description: string;
  icon: string;
  color: string;
  patterns: string[];
}

export interface CommandConfig {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  mode: string;
  preferences: PreferenceConfig[];
}

export interface PreferenceConfig {
  name: string;
  type: string;
  required: boolean;
  title: string;
  description: string;
  default?: string;
}

export class RegistryIntegrator {
  private readonly CATEGORY_MAPPINGS = {
    'wireframe': { category: 'UX Analysis', icon: '🎨', color: '#4A90E2' },
    'copywriting': { category: 'Content Analysis', icon: '✍️', color: '#7ED321' },
    'storybrand': { category: 'Marketing Analysis', icon: '📖', color: '#F5A623' },
    'competitive': { category: 'Business Analysis', icon: '🏆', color: '#D0021B' },
    'landing': { category: 'Landing Page Analysis', icon: '🚀', color: '#9013FE' },
    'conversion': { category: 'Conversion Optimization', icon: '📈', color: '#50E3C2' },
    'audit': { category: 'Strategic Analysis', icon: '🔍', color: '#BD10E0' }
  };

  private readonly ICON_MAPPINGS = {
    'analyze_wireframe_flow': '🎨',
    'analyze_copywriting_score': '✍️',
    'create_storybrand_variant': '📖',
    'create_competitive_audit': '🏆'
  };

  /**
   * Generate comprehensive metadata for a pattern
   */
  generatePatternMetadata(
    patternName: string,
    patternContent: string,
    samplesContent?: string
  ): PatternMetadata {
    const displayName = this.generateDisplayName(patternName);
    const description = this.extractDescription(patternContent);
    const category = this.determineCategory(patternName, patternContent);
    const icon = this.selectIcon(patternName, patternContent);
    const tags = this.generateTags(patternName, patternContent);
    const outputSections = this.extractOutputSections(patternContent);
    const scoringSystem = this.hasScoring(patternContent);
    const prioritization = this.hasPrioritization(patternContent);
    const sampleCount = this.countSamples(samplesContent);

    return {
      name: patternName,
      displayName,
      description,
      category,
      icon,
      tags,
      version: '1.0.0',
      author: 'Custom Pattern Creator',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      outputSections,
      scoringSystem,
      prioritization,
      sampleCount
    };
  }

  /**
   * Generate display name from pattern name
   */
  private generateDisplayName(patternName: string): string {
    return patternName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Extract description from pattern content
   */
  private extractDescription(patternContent: string): string {
    // Look for purpose statement in IDENTITY and PURPOSE section
    const purposeMatch = patternContent.match(/# IDENTITY and PURPOSE\s*\n\n([^#]+)/);
    if (purposeMatch) {
      const purposeText = purposeMatch[1].trim();
      // Extract the main purpose sentence
      const sentences = purposeText.split('.').filter(s => s.trim().length > 0);
      if (sentences.length > 1) {
        return sentences[1].trim() + '.';
      }
      return sentences[0].trim() + '.';
    }
    
    return 'Custom pattern for specialized analysis and insights.';
  }

  /**
   * Determine appropriate category for pattern
   */
  private determineCategory(patternName: string, patternContent: string): string {
    const name = patternName.toLowerCase();
    const content = patternContent.toLowerCase();

    // Check for specific pattern types
    if (name.includes('wireframe') || content.includes('user experience') || content.includes('ux analysis')) {
      return this.CATEGORY_MAPPINGS.wireframe.category;
    }
    if (name.includes('copywriting') || content.includes('copywriting') || content.includes('content analysis')) {
      return this.CATEGORY_MAPPINGS.copywriting.category;
    }
    if (name.includes('storybrand') || content.includes('storybrand') || content.includes('sb7')) {
      return this.CATEGORY_MAPPINGS.storybrand.category;
    }
    if (name.includes('competitive') || content.includes('competitive') || content.includes('swot')) {
      return this.CATEGORY_MAPPINGS.competitive.category;
    }
    if (name.includes('landing') || content.includes('landing page')) {
      return this.CATEGORY_MAPPINGS.landing.category;
    }
    if (name.includes('conversion') || content.includes('conversion')) {
      return this.CATEGORY_MAPPINGS.conversion.category;
    }
    if (name.includes('audit') || content.includes('audit')) {
      return this.CATEGORY_MAPPINGS.audit.category;
    }

    return 'Custom Analysis';
  }

  /**
   * Select appropriate icon for pattern
   */
  private selectIcon(patternName: string, patternContent: string): string {
    // Check for specific pattern mappings first
    if (this.ICON_MAPPINGS[patternName]) {
      return this.ICON_MAPPINGS[patternName];
    }

    const name = patternName.toLowerCase();
    const content = patternContent.toLowerCase();

    // Determine icon based on content analysis
    if (name.includes('wireframe') || content.includes('user experience')) return '🎨';
    if (name.includes('copywriting') || content.includes('copywriting')) return '✍️';
    if (name.includes('storybrand') || content.includes('storybrand')) return '📖';
    if (name.includes('competitive') || content.includes('competitive')) return '🏆';
    if (name.includes('landing') || content.includes('landing page')) return '🚀';
    if (name.includes('conversion') || content.includes('conversion')) return '📈';
    if (name.includes('audit') || content.includes('audit')) return '🔍';
    if (name.includes('analysis') || content.includes('analysis')) return '📊';
    if (name.includes('score') || content.includes('scoring')) return '📋';
    if (name.includes('strategy') || content.includes('strategic')) return '🎯';

    return '⚡'; // Default icon
  }

  /**
   * Generate relevant tags for pattern
   */
  private generateTags(patternName: string, patternContent: string): string[] {
    const tags: Set<string> = new Set();
    const name = patternName.toLowerCase();
    const content = patternContent.toLowerCase();

    // Add tags based on pattern name
    if (name.includes('analyze')) tags.add('analysis');
    if (name.includes('create')) tags.add('creation');
    if (name.includes('wireframe')) tags.add('ux');
    if (name.includes('copywriting')) tags.add('content');
    if (name.includes('storybrand')) tags.add('marketing');
    if (name.includes('competitive')) tags.add('business');
    if (name.includes('landing')) tags.add('landing-page');

    // Add tags based on content analysis
    if (content.includes('scoring') || content.includes('1-10')) tags.add('scoring');
    if (content.includes('swot')) tags.add('swot');
    if (content.includes('conversion')) tags.add('conversion');
    if (content.includes('optimization')) tags.add('optimization');
    if (content.includes('strategic')) tags.add('strategy');
    if (content.includes('benchmarking')) tags.add('benchmarking');
    if (content.includes('recommendations')) tags.add('recommendations');

    return Array.from(tags);
  }

  /**
   * Extract output sections from pattern content
   */
  private extractOutputSections(patternContent: string): string[] {
    const sections: string[] = [];
    const outputMatch = patternContent.match(/# OUTPUT\s*\n\n([\s\S]*?)(?=\n# |$)/);
    
    if (outputMatch) {
      const outputContent = outputMatch[1];
      const sectionMatches = outputContent.match(/- ([A-Z][A-Z\s/&]+):/g);
      
      if (sectionMatches) {
        sectionMatches.forEach(match => {
          const section = match.replace(/^- /, '').replace(/:$/, '').trim();
          sections.push(section);
        });
      }
    }

    return sections;
  }

  /**
   * Check if pattern has scoring system
   */
  private hasScoring(patternContent: string): boolean {
    return patternContent.includes('1-10') || 
           patternContent.includes('0-100') || 
           patternContent.includes('scoring') ||
           patternContent.includes('rating');
  }

  /**
   * Check if pattern has prioritization
   */
  private hasPrioritization(patternContent: string): boolean {
    return patternContent.includes('HIGH/MEDIUM/LOW') ||
           patternContent.includes('priority') ||
           patternContent.includes('prioritization');
  }

  /**
   * Count samples in samples content
   */
  private countSamples(samplesContent?: string): number {
    if (!samplesContent) return 0;
    const sampleMatches = samplesContent.match(/## Sample \d+:/g);
    return sampleMatches ? sampleMatches.length : 0;
  }

  /**
   * Generate registry configuration for patterns
   */
  generateRegistryConfiguration(patterns: PatternMetadata[]): RegistryConfiguration {
    const registryConfig: RegistryConfiguration = {
      patterns: {},
      categories: {},
      commands: {}
    };

    // Add patterns to registry
    patterns.forEach(pattern => {
      registryConfig.patterns[pattern.name] = pattern;
      
      // Add to category
      if (!registryConfig.categories[pattern.category]) {
        registryConfig.categories[pattern.category] = {
          name: pattern.category,
          description: `${pattern.category} patterns for specialized analysis`,
          icon: pattern.icon,
          color: this.getCategoryColor(pattern.category),
          patterns: []
        };
      }
      registryConfig.categories[pattern.category].patterns.push(pattern.name);

      // Generate command configuration
      registryConfig.commands[pattern.name] = this.generateCommandConfig(pattern);
    });

    return registryConfig;
  }

  /**
   * Get color for category
   */
  private getCategoryColor(category: string): string {
    const categoryKey = Object.keys(this.CATEGORY_MAPPINGS).find(key => 
      this.CATEGORY_MAPPINGS[key].category === category
    );
    return categoryKey ? this.CATEGORY_MAPPINGS[categoryKey].color : '#666666';
  }

  /**
   * Generate command configuration for pattern
   */
  private generateCommandConfig(pattern: PatternMetadata): CommandConfig {
    return {
      name: pattern.name,
      title: pattern.displayName,
      subtitle: pattern.category,
      description: pattern.description,
      mode: 'view',
      preferences: [
        {
          name: 'fabricPath',
          type: 'textfield',
          required: false,
          title: 'Fabric Installation Path',
          description: 'Path to fabric executable (optional)',
          default: 'fabric'
        },
        {
          name: 'outputFormat',
          type: 'dropdown',
          required: false,
          title: 'Output Format',
          description: 'Choose output format for results',
          default: 'markdown'
        }
      ]
    };
  }

  /**
   * Generate command file for pattern
   */
  generateCommandFile(pattern: PatternMetadata): string {
    const commandName = pattern.name.replace(/_/g, '-');
    
    return `import { ActionPanel, Action, Detail, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface Preferences {
  fabricPath: string;
  outputFormat: string;
}

export default function ${pattern.displayName.replace(/\s/g, '')}Command() {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const preferences = getPreferenceValues<Preferences>();

  const runPattern = async (input: string) => {
    setIsLoading(true);
    
    try {
      const fabricPath = preferences.fabricPath || 'fabric';
      const command = \`echo "\${input}" | \${fabricPath} --pattern ${pattern.name}\`;
      
      const { stdout, stderr } = await execAsync(command);
      
      if (stderr) {
        throw new Error(stderr);
      }
      
      setContent(stdout);
      showToast({
        style: Toast.Style.Success,
        title: "Analysis Complete",
        message: "${pattern.displayName} analysis finished"
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Analysis Failed",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
      setContent(\`Error: \${error instanceof Error ? error.message : "Unknown error"}\`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Detail
      isLoading={isLoading}
      markdown={content || \`# ${pattern.displayName}

${pattern.description}

## How to use:
1. Copy your content to analyze
2. Use the "Analyze Content" action
3. View the detailed ${pattern.category.toLowerCase()} results

## Output includes:
${pattern.outputSections.map(section => `- ${section}`).join('\n')}

${pattern.scoringSystem ? '## Scoring System:\n- Detailed scoring (1-10) for each analysis section' : ''}
${pattern.prioritization ? '- Priority recommendations (HIGH/MEDIUM/LOW)' : ''}
\`}
      actions={
        <ActionPanel>
          <Action
            title="Analyze Content"
            onAction={() => {
              // This would typically get content from clipboard or user input
              const sampleInput = "Paste your content here for ${pattern.category.toLowerCase()} analysis";
              runPattern(sampleInput);
            }}
          />
          <Action.CopyToClipboard
            title="Copy Results"
            content={content}
            shortcut={{ modifiers: ["cmd"], key: "c" }}
          />
        </ActionPanel>
      }
    />
  );
}`;
  }

  /**
   * Generate package.json command entries
   */
  generatePackageJsonCommands(patterns: PatternMetadata[]): Record<string, any> {
    const commands: Record<string, any> = {};

    patterns.forEach(pattern => {
      const commandName = pattern.name.replace(/_/g, '-');
      commands[commandName] = {
        name: commandName,
        title: pattern.displayName,
        subtitle: pattern.category,
        description: pattern.description,
        mode: "view"
      };
    });

    return commands;
  }

  /**
   * Register pattern with existing registry system
   */
  async registerPattern(
    patternName: string,
    patternContent: string,
    samplesContent?: string
  ): Promise<PatternMetadata> {
    // Generate metadata
    const metadata = this.generatePatternMetadata(patternName, patternContent, samplesContent);
    
    // Generate command file
    const commandFile = this.generateCommandFile(metadata);
    
    // This would typically write files to the appropriate locations
    console.log(`Registering pattern: ${patternName}`);
    console.log(`Category: ${metadata.category}`);
    console.log(`Icon: ${metadata.icon}`);
    console.log(`Tags: ${metadata.tags.join(', ')}`);
    console.log(`Output sections: ${metadata.outputSections.length}`);
    console.log(`Has scoring: ${metadata.scoringSystem}`);
    console.log(`Has prioritization: ${metadata.prioritization}`);
    console.log(`Sample count: ${metadata.sampleCount}`);
    
    return metadata;
  }

  /**
   * Batch register multiple patterns
   */
  async registerMultiplePatterns(
    patterns: Array<{
      name: string;
      content: string;
      samples?: string;
    }>
  ): Promise<PatternMetadata[]> {
    const registeredPatterns: PatternMetadata[] = [];

    for (const pattern of patterns) {
      const metadata = await this.registerPattern(
        pattern.name,
        pattern.content,
        pattern.samples
      );
      registeredPatterns.push(metadata);
    }

    // Generate registry configuration
    const registryConfig = this.generateRegistryConfiguration(registeredPatterns);
    
    console.log('Registry Configuration Generated:');
    console.log(`- ${Object.keys(registryConfig.patterns).length} patterns`);
    console.log(`- ${Object.keys(registryConfig.categories).length} categories`);
    console.log(`- ${Object.keys(registryConfig.commands).length} commands`);

    return registeredPatterns;
  }
}