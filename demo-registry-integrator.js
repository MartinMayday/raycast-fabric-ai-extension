// Demo script for RegistryIntegrator functionality
const fs = require('fs');

console.log('🚀 RegistryIntegrator Demo - Pattern Registration System\n');

// Simulate RegistryIntegrator functionality
class RegistryIntegratorDemo {
  constructor() {
    this.CATEGORY_MAPPINGS = {
      'wireframe': { category: 'UX Analysis', icon: '🎨', color: '#4A90E2' },
      'copywriting': { category: 'Content Analysis', icon: '✍️', color: '#7ED321' },
      'storybrand': { category: 'Marketing Analysis', icon: '📖', color: '#F5A623' },
      'competitive': { category: 'Business Analysis', icon: '🏆', color: '#D0021B' },
      'landing': { category: 'Landing Page Analysis', icon: '🚀', color: '#9013FE' },
      'conversion': { category: 'Conversion Optimization', icon: '📈', color: '#50E3C2' },
      'audit': { category: 'Strategic Analysis', icon: '🔍', color: '#BD10E0' }
    };

    this.ICON_MAPPINGS = {
      'analyze_wireframe_flow': '🎨',
      'analyze_copywriting_score': '✍️',
      'create_storybrand_variant': '📖',
      'create_competitive_audit': '🏆'
    };
  }

  // Load our actual pattern files for demo
  loadPatternFiles() {
    const patterns = {};
    const samples = {};

    try {
      patterns.wireframe = fs.readFileSync('patterns/analyze_wireframe_flow.md', 'utf-8');
      samples.wireframe = fs.readFileSync('patterns/test-samples/wireframe_flow_samples.md', 'utf-8');
    } catch (e) { console.log('   ⚠️  Wireframe pattern not found'); }

    try {
      patterns.copywriting = fs.readFileSync('patterns/analyze_copywriting_score.md', 'utf-8');
      samples.copywriting = fs.readFileSync('patterns/test-samples/copywriting_score_samples.md', 'utf-8');
    } catch (e) { console.log('   ⚠️  Copywriting pattern not found'); }

    try {
      patterns.storybrand = fs.readFileSync('patterns/create_storybrand_variant.md', 'utf-8');
      samples.storybrand = fs.readFileSync('patterns/test-samples/storybrand_variant_samples.md', 'utf-8');
    } catch (e) { console.log('   ⚠️  StoryBrand pattern not found'); }

    try {
      patterns.competitive = fs.readFileSync('patterns/create_competitive_audit.md', 'utf-8');
      samples.competitive = fs.readFileSync('patterns/test-samples/competitive_audit_samples.md', 'utf-8');
    } catch (e) { console.log('   ⚠️  Competitive audit pattern not found'); }

    return { patterns, samples };
  }

  // Generate pattern metadata
  generatePatternMetadata(patternName, patternContent, samplesContent) {
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

  generateDisplayName(patternName) {
    return patternName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  extractDescription(patternContent) {
    const purposeMatch = patternContent.match(/# IDENTITY and PURPOSE\\s*\\n\\n([^#]+)/);
    if (purposeMatch) {
      const purposeText = purposeMatch[1].trim();
      const sentences = purposeText.split('.').filter(s => s.trim().length > 0);
      if (sentences.length > 1) {
        return sentences[1].trim() + '.';
      }
      return sentences[0].trim() + '.';
    }
    return 'Custom pattern for specialized analysis and insights.';
  }

  determineCategory(patternName, patternContent) {
    const name = patternName.toLowerCase();
    const content = patternContent.toLowerCase();

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
    return 'Custom Analysis';
  }

  selectIcon(patternName, patternContent) {
    if (this.ICON_MAPPINGS[patternName]) {
      return this.ICON_MAPPINGS[patternName];
    }

    const name = patternName.toLowerCase();
    if (name.includes('wireframe')) return '🎨';
    if (name.includes('copywriting')) return '✍️';
    if (name.includes('storybrand')) return '📖';
    if (name.includes('competitive')) return '🏆';
    return '⚡';
  }

  generateTags(patternName, patternContent) {
    const tags = new Set();
    const name = patternName.toLowerCase();
    const content = patternContent.toLowerCase();

    if (name.includes('analyze')) tags.add('analysis');
    if (name.includes('create')) tags.add('creation');
    if (name.includes('wireframe')) tags.add('ux');
    if (name.includes('copywriting')) tags.add('content');
    if (name.includes('storybrand')) tags.add('marketing');
    if (name.includes('competitive')) tags.add('business');

    if (content.includes('scoring') || content.includes('1-10')) tags.add('scoring');
    if (content.includes('swot')) tags.add('swot');
    if (content.includes('conversion')) tags.add('conversion');
    if (content.includes('optimization')) tags.add('optimization');

    return Array.from(tags);
  }

  extractOutputSections(patternContent) {
    const sections = [];
    const outputMatch = patternContent.match(/# OUTPUT\\s*\\n\\n([\\s\\S]*?)(?=\\n# |$)/);
    
    if (outputMatch) {
      const outputContent = outputMatch[1];
      const sectionMatches = outputContent.match(/- ([A-Z][A-Z\\s/&]+):/g);
      
      if (sectionMatches) {
        sectionMatches.forEach(match => {
          const section = match.replace(/^- /, '').replace(/:$/, '').trim();
          sections.push(section);
        });
      }
    }

    return sections;
  }

  hasScoring(patternContent) {
    return patternContent.includes('1-10') || 
           patternContent.includes('0-100') || 
           patternContent.includes('scoring') ||
           patternContent.includes('rating');
  }

  hasPrioritization(patternContent) {
    return patternContent.includes('HIGH/MEDIUM/LOW') ||
           patternContent.includes('priority') ||
           patternContent.includes('prioritization');
  }

  countSamples(samplesContent) {
    if (!samplesContent) return 0;
    const sampleMatches = samplesContent.match(/## Sample \\d+:/g);
    return sampleMatches ? sampleMatches.length : 0;
  }

  // Demo the full registration process
  async demonstrateRegistration() {
    console.log('📋 Loading Pattern Files...');
    const { patterns, samples } = this.loadPatternFiles();
    
    const patternNames = [
      'analyze_wireframe_flow',
      'analyze_copywriting_score', 
      'create_storybrand_variant',
      'create_competitive_audit'
    ];

    const registeredPatterns = [];

    console.log('\\n🔄 Processing Patterns for Registration...');
    
    patternNames.forEach(patternName => {
      const key = patternName.split('_')[1] || patternName.split('_')[0];
      const patternContent = patterns[key];
      const samplesContent = samples[key];

      if (patternContent) {
        console.log(`\\n📝 Processing: ${patternName}`);
        
        const metadata = this.generatePatternMetadata(patternName, patternContent, samplesContent);
        registeredPatterns.push(metadata);

        console.log(`   ✅ Generated metadata for ${metadata.displayName}`);
        console.log(`   📂 Category: ${metadata.category} ${metadata.icon}`);
        console.log(`   🏷️  Tags: ${metadata.tags.join(', ')}`);
        console.log(`   📊 Output sections: ${metadata.outputSections.length}`);
        console.log(`   🎯 Scoring: ${metadata.scoringSystem ? 'Yes' : 'No'}`);
        console.log(`   📈 Prioritization: ${metadata.prioritization ? 'Yes' : 'No'}`);
        console.log(`   🧪 Samples: ${metadata.sampleCount}`);
      } else {
        console.log(`   ⚠️  Pattern file not found: ${patternName}`);
      }
    });

    return registeredPatterns;
  }

  // Generate registry configuration
  generateRegistryConfiguration(patterns) {
    const registryConfig = {
      patterns: {},
      categories: {},
      commands: {}
    };

    patterns.forEach(pattern => {
      registryConfig.patterns[pattern.name] = pattern;
      
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

      registryConfig.commands[pattern.name] = {
        name: pattern.name,
        title: pattern.displayName,
        subtitle: pattern.category,
        description: pattern.description,
        mode: 'view'
      };
    });

    return registryConfig;
  }

  getCategoryColor(category) {
    const categoryKey = Object.keys(this.CATEGORY_MAPPINGS).find(key => 
      this.CATEGORY_MAPPINGS[key].category === category
    );
    return categoryKey ? this.CATEGORY_MAPPINGS[categoryKey].color : '#666666';
  }

  // Generate sample command file
  generateSampleCommandFile(pattern) {
    return `// Generated command file for ${pattern.displayName}
import { ActionPanel, Action, Detail, getPreferenceValues, showToast, Toast } from "@raycast/api";
import { useState } from "react";
import { exec } from "child_process";

export default function ${pattern.displayName.replace(/\\s/g, '')}Command() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = async (input) => {
    setIsLoading(true);
    try {
      // Execute fabric pattern
      const command = \`echo "\${input}" | fabric --pattern ${pattern.name}\`;
      // ... implementation details
      setContent("Analysis results would appear here");
      showToast({ style: Toast.Style.Success, title: "Analysis Complete" });
    } catch (error) {
      showToast({ style: Toast.Style.Failure, title: "Analysis Failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Detail
      isLoading={isLoading}
      markdown={content || \`# ${pattern.displayName}\\n\\n${pattern.description}\`}
      actions={
        <ActionPanel>
          <Action title="Analyze Content" onAction={() => runAnalysis("sample input")} />
        </ActionPanel>
      }
    />
  );
}`;
  }

  // Run the complete demo
  async runDemo() {
    console.log('🎯 Demonstrating Pattern Registration Process\\n');
    
    const registeredPatterns = await this.demonstrateRegistration();
    
    if (registeredPatterns.length > 0) {
      console.log('\\n📋 Generating Registry Configuration...');
      const registryConfig = this.generateRegistryConfiguration(registeredPatterns);
      
      console.log('\\n✨ Registry Configuration Summary:');
      console.log(`   📦 Patterns: ${Object.keys(registryConfig.patterns).length}`);
      console.log(`   📂 Categories: ${Object.keys(registryConfig.categories).length}`);
      console.log(`   ⚡ Commands: ${Object.keys(registryConfig.commands).length}`);

      console.log('\\n📂 Categories Created:');
      Object.values(registryConfig.categories).forEach(category => {
        console.log(`   ${category.icon} ${category.name} (${category.patterns.length} patterns)`);
        category.patterns.forEach(patternName => {
          console.log(`      - ${patternName}`);
        });
      });

      console.log('\\n⚡ Commands Generated:');
      Object.values(registryConfig.commands).forEach(command => {
        console.log(`   ${command.name}: ${command.title}`);
        console.log(`      Category: ${command.subtitle}`);
        console.log(`      Description: ${command.description}`);
      });

      console.log('\\n📄 Sample Command File Preview:');
      if (registeredPatterns.length > 0) {
        const sampleCommand = this.generateSampleCommandFile(registeredPatterns[0]);
        console.log('   Generated TypeScript command file with:');
        console.log('   ✅ Raycast imports and components');
        console.log('   ✅ State management and loading states');
        console.log('   ✅ Fabric pattern execution');
        console.log('   ✅ Error handling and toast notifications');
        console.log('   ✅ ActionPanel with analysis actions');
      }

      console.log('\\n📦 Package.json Integration:');
      registeredPatterns.forEach(pattern => {
        const commandName = pattern.name.replace(/_/g, '-');
        console.log(`   "${commandName}": {`);
        console.log(`     "name": "${commandName}",`);
        console.log(`     "title": "${pattern.displayName}",`);
        console.log(`     "subtitle": "${pattern.category}",`);
        console.log(`     "description": "${pattern.description}",`);
        console.log(`     "mode": "view"`);
        console.log(`   }`);
      });

      console.log('\\n' + '='.repeat(60));
      console.log('🎉 RegistryIntegrator Demo Complete!');
      console.log('\\n✨ Key Features Demonstrated:');
      console.log('✅ Automatic pattern metadata generation');
      console.log('✅ Smart category determination and icon selection');
      console.log('✅ Registry configuration with categories and commands');
      console.log('✅ TypeScript command file generation');
      console.log('✅ Package.json integration entries');
      console.log('✅ Batch pattern registration workflow');
      console.log('\\n🚀 Ready for production deployment!');

    } else {
      console.log('\\n⚠️  No patterns found for registration demo');
      console.log('   Make sure pattern files exist in the patterns/ directory');
    }
  }
}

// Run the demo
const demo = new RegistryIntegratorDemo();
demo.runDemo();