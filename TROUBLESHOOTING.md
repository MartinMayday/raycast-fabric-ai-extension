# Custom Pattern Creation - Troubleshooting Guide

## 🔧 Troubleshooting Guide & FAQ

**Version**: 1.0  
**Last Updated**: ${new Date().toISOString()}  
**Support Level**: Production Ready

---

## 🚨 Common Issues & Solutions

### Pattern Execution Issues

#### Issue: Pattern Not Found or Not Loading
**Symptoms:**
- "Pattern not found" error in Raycast
- Command doesn't appear in Raycast search
- Pattern fails to load when selected

**Possible Causes:**
- Pattern not properly deployed
- Raycast extension not updated
- Pattern registry corruption
- File permissions issues

**Solutions:**
1. **Verify Pattern Deployment**
   ```bash
   # Check if pattern is registered
   ls -la patterns/
   grep "pattern-name" patterns/registry.json
   ```

2. **Restart Raycast Extension**
   - Open Raycast preferences
   - Go to Extensions
   - Find FabricAI extension
   - Click "Reload Extension"

3. **Re-deploy Pattern**
   ```typescript
   const deployer = new DeploymentIntegrator();
   const result = deployer.deployPattern(patternContent, config);
   console.log('Deployment result:', result);
   ```

4. **Check File Permissions**
   ```bash
   chmod 644 patterns/*.md
   chmod 755 patterns/
   ```

---

#### Issue: Pattern Execution Timeout
**Symptoms:**
- Pattern starts but never completes
- "Request timeout" error
- Raycast shows loading indefinitely

**Possible Causes:**
- Large input content
- Network connectivity issues
- Fabric AI service unavailable
- Memory limitations

**Solutions:**
1. **Reduce Input Size**
   - Break large content into smaller chunks
   - Remove unnecessary whitespace and formatting
   - Focus on essential content only

2. **Check Network Connection**
   ```bash
   ping api.fabric.ai
   curl -I https://api.fabric.ai/health
   ```

3. **Increase Timeout Settings**
   ```typescript
   const options = {
     timeout: 30000, // 30 seconds
     retryAttempts: 3
   };
   ```

4. **Monitor Memory Usage**
   ```bash
   # Check available memory
   free -h
   # Monitor process memory
   ps aux | grep raycast
   ```

---

#### Issue: Poor Quality Pattern Results
**Symptoms:**
- Generic or unhelpful recommendations
- Low quality scores (below 70%)
- Missing analysis sections
- Irrelevant suggestions

**Possible Causes:**
- Insufficient input context
- Vague or unclear input content
- Pattern not optimized for use case
- Quality threshold too high

**Solutions:**
1. **Improve Input Quality**
   ```
   BAD INPUT:
   "Analyze this landing page"
   
   GOOD INPUT:
   "E-commerce product page for wireless headphones targeting tech-savvy consumers aged 25-45. Current conversion rate is 2.1%, goal is 3.5%. Main concerns: users browse but don't convert, unclear if layout guides to purchase decision."
   ```

2. **Add More Context**
   - Include target audience details
   - Specify business goals and metrics
   - Mention current problems or concerns
   - Provide competitor examples

3. **Use Appropriate Pattern**
   - Wireframe Analysis: For layout and UX issues
   - Copywriting Evaluation: For messaging problems
   - StoryBrand Framework: For unclear value proposition
   - Competitive Analysis: For positioning challenges

4. **Adjust Quality Thresholds**
   ```typescript
   const qualitySystem = new QualityAssuranceSystem({
     threshold: 60, // Lower threshold for initial testing
     enableRecommendations: true
   });
   ```

---

### Export & Integration Issues

#### Issue: CSV Export Fails
**Symptoms:**
- "Export failed" error message
- Empty or corrupted CSV files
- Missing data in exported files

**Possible Causes:**
- File permissions issues
- Disk space limitations
- Invalid characters in data
- Export path not accessible

**Solutions:**
1. **Check File Permissions**
   ```bash
   # Check write permissions
   ls -la ~/Downloads/
   touch ~/Downloads/test.csv
   rm ~/Downloads/test.csv
   ```

2. **Verify Disk Space**
   ```bash
   df -h
   du -sh ~/Downloads/
   ```

3. **Clean Data Before Export**
   ```typescript
   const cleanData = data.map(item => ({
     ...item,
     description: item.description.replace(/[^\w\s]/gi, '') // Remove special chars
   }));
   ```

4. **Use Alternative Export Path**
   ```typescript
   const exportPath = process.env.HOME + '/Desktop/pattern-results.csv';
   ```

---

#### Issue: Notion Export Not Working
**Symptoms:**
- "Notion API error" messages
- Data not appearing in Notion database
- Authentication failures

**Possible Causes:**
- Invalid Notion API token
- Incorrect database ID
- Missing database permissions
- API rate limiting

**Solutions:**
1. **Verify Notion Configuration**
   ```typescript
   // Check API token format
   const token = process.env.NOTION_API_TOKEN;
   console.log('Token format:', token?.startsWith('secret_'));
   
   // Verify database ID
   const databaseId = 'your-database-id';
   console.log('Database ID length:', databaseId.length); // Should be 32 chars
   ```

2. **Test Notion Connection**
   ```bash
   curl -X GET https://api.notion.com/v1/databases/YOUR_DATABASE_ID \
     -H "Authorization: Bearer YOUR_API_TOKEN" \
     -H "Notion-Version: 2022-06-28"
   ```

3. **Check Database Permissions**
   - Ensure integration has access to database
   - Verify write permissions are granted
   - Check if database is in correct workspace

4. **Handle Rate Limiting**
   ```typescript
   const notionExporter = new NotionExporter({
     retryAttempts: 3,
     retryDelay: 1000, // 1 second between retries
     respectRateLimit: true
   });
   ```

---

### Quality & Validation Issues

#### Issue: Quality Assessment Fails
**Symptoms:**
- "Quality assessment error" messages
- Missing quality scores
- Validation failures

**Possible Causes:**
- Malformed pattern structure
- Missing required sections
- Invalid scoring criteria
- System configuration issues

**Solutions:**
1. **Validate Pattern Structure**
   ```typescript
   const validator = new PatternValidator();
   const result = validator.validatePattern(patternContent);
   
   if (!result.isValid) {
     console.log('Validation errors:', result.errors);
     console.log('Suggestions:', result.suggestions);
   }
   ```

2. **Check Required Sections**
   ```markdown
   # Required pattern sections:
   # IDENTITY
   # PURPOSE  
   # STEPS
   # OUTPUT
   ```

3. **Reset Quality Thresholds**
   ```typescript
   const qualitySystem = new QualityAssuranceSystem();
   qualitySystem.setQualityThresholds({
     minimum: 50,
     target: 70,
     excellent: 85
   });
   ```

---

### Performance Issues

#### Issue: Slow Pattern Execution
**Symptoms:**
- Patterns take longer than 10 seconds
- System becomes unresponsive
- High CPU or memory usage

**Possible Causes:**
- Large input files
- Complex pattern logic
- Memory leaks
- Inefficient algorithms

**Solutions:**
1. **Optimize Input Size**
   ```typescript
   // Limit input size
   const MAX_INPUT_SIZE = 10000; // 10KB
   if (input.length > MAX_INPUT_SIZE) {
     input = input.substring(0, MAX_INPUT_SIZE) + '...';
   }
   ```

2. **Enable Performance Monitoring**
   ```typescript
   const monitor = new PerformanceMonitor();
   const result = monitor.measureExecution(() => {
     return pattern.execute(input);
   });
   
   console.log('Execution time:', result.metrics.executionTime);
   console.log('Memory usage:', result.metrics.memoryUsage);
   ```

3. **Use Caching**
   ```typescript
   const cacheManager = new CacheManager({
     maxSize: 100,
     ttl: 3600000 // 1 hour
   });
   
   const cachedResult = cacheManager.get(inputHash);
   if (cachedResult) {
     return cachedResult;
   }
   ```

4. **Implement Batch Processing**
   ```typescript
   const batchProcessor = new BatchProcessor({
     batchSize: 10,
     concurrency: 3
   });
   
   const results = await batchProcessor.process(inputs);
   ```

---

## 🔍 Diagnostic Tools

### System Health Check

```typescript
class SystemHealthChecker {
  async runHealthCheck(): Promise<HealthReport> {
    const report: HealthReport = {
      timestamp: new Date(),
      status: 'healthy',
      checks: []
    };
    
    // Check pattern registry
    try {
      const registry = await this.checkPatternRegistry();
      report.checks.push({
        name: 'Pattern Registry',
        status: registry.isHealthy ? 'pass' : 'fail',
        details: registry.details
      });
    } catch (error) {
      report.checks.push({
        name: 'Pattern Registry',
        status: 'error',
        details: error.message
      });
    }
    
    // Check quality system
    try {
      const quality = await this.checkQualitySystem();
      report.checks.push({
        name: 'Quality System',
        status: quality.isHealthy ? 'pass' : 'fail',
        details: quality.details
      });
    } catch (error) {
      report.checks.push({
        name: 'Quality System',
        status: 'error',
        details: error.message
      });
    }
    
    // Check export systems
    try {
      const exports = await this.checkExportSystems();
      report.checks.push({
        name: 'Export Systems',
        status: exports.isHealthy ? 'pass' : 'fail',
        details: exports.details
      });
    } catch (error) {
      report.checks.push({
        name: 'Export Systems',
        status: 'error',
        details: error.message
      });
    }
    
    // Determine overall status
    const failedChecks = report.checks.filter(c => c.status === 'fail' || c.status === 'error');
    if (failedChecks.length > 0) {
      report.status = failedChecks.length === report.checks.length ? 'unhealthy' : 'degraded';
    }
    
    return report;
  }
}
```

### Debug Mode

```typescript
class DebugManager {
  private debugEnabled: boolean = false;
  
  enableDebug(): void {
    this.debugEnabled = true;
    console.log('Debug mode enabled');
  }
  
  disableDebug(): void {
    this.debugEnabled = false;
    console.log('Debug mode disabled');
  }
  
  debug(component: string, message: string, data?: any): void {
    if (this.debugEnabled) {
      console.log(`[DEBUG:${component}] ${message}`, data || '');
    }
  }
  
  trace(component: string, operation: string, startTime: number): void {
    if (this.debugEnabled) {
      const duration = Date.now() - startTime;
      console.log(`[TRACE:${component}] ${operation} completed in ${duration}ms`);
    }
  }
}

// Usage
const debug = new DebugManager();
debug.enableDebug();

const startTime = Date.now();
const result = await pattern.execute(input);
debug.trace('PatternExecution', 'execute', startTime);
```

---

## 📊 Error Codes Reference

### System Error Codes

| Code | Category | Description | Solution |
|------|----------|-------------|----------|
| **E001** | Pattern | Pattern not found | Check pattern deployment |
| **E002** | Pattern | Invalid pattern format | Validate pattern structure |
| **E003** | Pattern | Pattern execution timeout | Reduce input size or increase timeout |
| **E004** | Quality | Quality threshold not met | Improve pattern or lower threshold |
| **E005** | Quality | Validation failed | Fix validation errors |
| **E006** | Export | CSV export failed | Check file permissions |
| **E007** | Export | Notion API error | Verify API token and permissions |
| **E008** | System | Memory limit exceeded | Reduce input size or increase memory |
| **E009** | System | Network connection failed | Check internet connection |
| **E010** | System | Configuration error | Verify system configuration |

### Quality Error Codes

| Code | Issue | Threshold | Action |
|------|-------|-----------|--------|
| **Q001** | Clarity score too low | < 60% | Improve pattern clarity |
| **Q002** | Completeness missing | < 70% | Add missing sections |
| **Q003** | Usability issues | < 65% | Simplify pattern usage |
| **Q004** | Effectiveness low | < 70% | Enhance pattern logic |
| **Q005** | Test failures | > 20% | Fix failing tests |

---

## 🛠️ Advanced Troubleshooting

### Memory Issues

```typescript
// Monitor memory usage
class MemoryMonitor {
  static checkMemoryUsage(): MemoryInfo {
    const usage = process.memoryUsage();
    return {
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
      external: Math.round(usage.external / 1024 / 1024), // MB
      rss: Math.round(usage.rss / 1024 / 1024) // MB
    };
  }
  
  static isMemoryHigh(): boolean {
    const usage = this.checkMemoryUsage();
    return usage.heapUsed > 500; // 500MB threshold
  }
  
  static forceGarbageCollection(): void {
    if (global.gc) {
      global.gc();
      console.log('Garbage collection forced');
    }
  }
}

// Usage in pattern execution
if (MemoryMonitor.isMemoryHigh()) {
  console.warn('High memory usage detected');
  MemoryMonitor.forceGarbageCollection();
}
```

### Network Debugging

```typescript
// Network connectivity checker
class NetworkChecker {
  static async checkConnectivity(): Promise<ConnectivityReport> {
    const endpoints = [
      'https://api.fabric.ai',
      'https://api.notion.com',
      'https://www.google.com'
    ];
    
    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const start = Date.now();
        try {
          const response = await fetch(endpoint, { 
            method: 'HEAD',
            timeout: 5000 
          });
          return {
            endpoint,
            status: 'success',
            responseTime: Date.now() - start,
            statusCode: response.status
          };
        } catch (error) {
          return {
            endpoint,
            status: 'failed',
            responseTime: Date.now() - start,
            error: error.message
          };
        }
      })
    );
    
    return {
      timestamp: new Date(),
      results: results.map(r => r.status === 'fulfilled' ? r.value : r.reason)
    };
  }
}
```

### Configuration Validation

```typescript
// Configuration validator
class ConfigValidator {
  static validateSystemConfig(config: SystemConfig): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Check required fields
    if (!config.qualityThreshold) {
      errors.push('Quality threshold is required');
    } else if (config.qualityThreshold < 0 || config.qualityThreshold > 100) {
      errors.push('Quality threshold must be between 0 and 100');
    }
    
    // Check API configurations
    if (config.apis?.notion?.token && !config.apis.notion.token.startsWith('secret_')) {
      warnings.push('Notion API token format may be incorrect');
    }
    
    // Check performance settings
    if (config.performance?.timeout && config.performance.timeout < 1000) {
      warnings.push('Timeout setting may be too low (< 1 second)');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions: this.generateSuggestions(config)
    };
  }
  
  private static generateSuggestions(config: SystemConfig): string[] {
    const suggestions: string[] = [];
    
    if (!config.enableMetrics) {
      suggestions.push('Consider enabling metrics for better monitoring');
    }
    
    if (!config.knowledgeBase?.enabled) {
      suggestions.push('Enable knowledge base for better recommendations');
    }
    
    return suggestions;
  }
}
```

---

## 📞 Getting Help

### Self-Service Resources

1. **Documentation Review**
   - Check USER_GUIDE.md for usage instructions
   - Review API_REFERENCE.md for technical details
   - Consult ARCHITECTURE.md for system understanding

2. **Log Analysis**
   ```bash
   # Check system logs
   tail -f ~/.raycast/logs/extensions.log
   
   # Check pattern execution logs
   grep "pattern-creation" ~/.raycast/logs/extensions.log
   
   # Check error logs
   grep "ERROR" ~/.raycast/logs/extensions.log | tail -20
   ```

3. **System Information Collection**
   ```typescript
   // Collect system info for support
   const systemInfo = {
     platform: process.platform,
     nodeVersion: process.version,
     raycastVersion: '1.x.x', // Check Raycast version
     extensionVersion: '1.0.0',
     memoryUsage: process.memoryUsage(),
     timestamp: new Date().toISOString()
   };
   
   console.log('System Info:', JSON.stringify(systemInfo, null, 2));
   ```

### Support Escalation

If self-service doesn't resolve the issue:

1. **Gather Information**
   - Error messages and codes
   - Steps to reproduce
   - System information
   - Log files

2. **Create Support Request**
   - Include all gathered information
   - Specify urgency level
   - Describe business impact

3. **Temporary Workarounds**
   - Use alternative patterns
   - Reduce input complexity
   - Export manually if needed
   - Restart system components

---

## 🔄 Maintenance & Prevention

### Regular Maintenance Tasks

1. **Weekly**
   - Check system health
   - Review error logs
   - Monitor performance metrics
   - Update pattern registry

2. **Monthly**
   - Clean up old logs
   - Update dependencies
   - Review quality trends
   - Optimize configurations

3. **Quarterly**
   - Full system backup
   - Performance review
   - Security audit
   - Documentation update

### Preventive Measures

```typescript
// Automated health monitoring
class HealthMonitor {
  private intervalId: NodeJS.Timeout | null = null;
  
  startMonitoring(intervalMs: number = 300000): void { // 5 minutes
    this.intervalId = setInterval(async () => {
      try {
        const health = await this.checkSystemHealth();
        if (health.status !== 'healthy') {
          console.warn('System health issue detected:', health);
          await this.attemptAutoRecovery(health);
        }
      } catch (error) {
        console.error('Health monitoring error:', error);
      }
    }, intervalMs);
  }
  
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  private async attemptAutoRecovery(health: HealthReport): Promise<void> {
    // Implement auto-recovery logic
    // - Clear caches
    // - Restart failed components
    // - Notify administrators
  }
}
```

---

**This troubleshooting guide provides comprehensive solutions for common issues and advanced diagnostic tools for complex problems. Regular maintenance and monitoring help prevent issues before they impact users.**

Generated: ${new Date().toISOString()}  
Version: 1.0  
Status: Complete Troubleshooting Guide