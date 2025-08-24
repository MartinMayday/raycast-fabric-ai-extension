# Requirements Document

## Introduction

The Notion Watcher Automation feature creates an intelligent monitoring system that automatically detects new URLs added to a Notion database and triggers appropriate pattern extraction workflows based on content type. This system enables users to save URLs from mobile devices or other sources and have them automatically processed through relevant Fabric AI pattern chains, providing prioritized insights without manual intervention. The system supports different content types (video, repo, webshop, landingpage, unspecified) with tailored extraction workflows for each type.

## Requirements

### Requirement 1

**User Story:** As a busy professional who saves URLs for later review, I want an automated system that monitors my Notion database for new URLs and automatically processes them through relevant analysis patterns, so that I can prioritize which content to consume based on extracted insights.

#### Acceptance Criteria

1. WHEN a new URL is added to the monitored Notion database THEN the system SHALL detect the addition within 5-15 minutes using polling or webhook mechanisms
2. WHEN a URL is detected THEN the system SHALL extract the URL and associated content type tag (video, repo, webshop, landingpage, unspecified)
3. WHEN content type is identified THEN the system SHALL trigger the appropriate pattern chain workflow for that content type
4. WHEN pattern extraction completes THEN the system SHALL update the original Notion page with extracted insights and analysis results

### Requirement 2

**User Story:** As a user processing video content, I want the system to automatically extract wisdom and actionable insights from YouTube videos and other video URLs, so that I can quickly determine which videos are worth watching and what key information they contain.

#### Acceptance Criteria

1. WHEN a URL is tagged as "video" content THEN the system SHALL execute the video analysis pattern chain: extract_wisdom_dm → extract_questions → extract_primary_problem → extract_primary_solution → extract_instructions
2. WHEN video analysis completes THEN the system SHALL provide prioritization insights including key topics, questions raised, problems addressed, and actionable instructions
3. WHEN YouTube videos are processed THEN the system SHALL extract video metadata including title, channel, duration, and description
4. WHEN video processing fails THEN the system SHALL log the error and attempt alternative extraction methods or mark for manual review

### Requirement 3

**User Story:** As a developer monitoring GitHub repositories, I want the system to automatically analyze repo URLs and extract project information, technical insights, and business opportunities, so that I can quickly assess the value and relevance of different projects.

#### Acceptance Criteria

1. WHEN a URL is tagged as "repo" content THEN the system SHALL execute the repository analysis pattern chain: explain_project → extract_instructions → analyze_tech_impact → create_coding_feature → extract_business_ideas
2. WHEN repository analysis completes THEN the system SHALL provide project understanding, setup instructions, technology impact assessment, potential features, and business opportunities
3. WHEN GitHub repositories are processed THEN the system SHALL extract repository metadata including stars, forks, language, and recent activity
4. WHEN repository processing encounters private or inaccessible repos THEN the system SHALL handle gracefully and provide available public information

### Requirement 4

**User Story:** As a business analyst monitoring e-commerce and webshop URLs, I want the system to automatically analyze business models, sales approaches, and competitive insights, so that I can understand market trends and business opportunities.

#### Acceptance Criteria

1. WHEN a URL is tagged as "webshop" content THEN the system SHALL execute the e-commerce analysis pattern chain: extract_business_ideas → analyze_sales_call → create_hormozi_offer → extract_patterns → analyze_risk
2. WHEN webshop analysis completes THEN the system SHALL provide business model insights, sales approach analysis, value proposition assessment, recurring patterns, and competitive risk evaluation
3. WHEN e-commerce sites are processed THEN the system SHALL extract product information, pricing strategies, and conversion elements
4. WHEN webshop processing encounters restricted content THEN the system SHALL adapt analysis to available public information

### Requirement 5

**User Story:** As a marketing professional analyzing landing pages, I want the system to automatically evaluate UX design, copywriting effectiveness, and competitive positioning, so that I can learn from successful pages and identify improvement opportunities.

#### Acceptance Criteria

1. WHEN a URL is tagged as "landingpage" content THEN the system SHALL execute the landing page analysis pattern chain: convert_to_markdown → analyze_wireframe_flow → analyze_copywriting_score → create_storybrand_variant → create_competitive_audit
2. WHEN landing page analysis completes THEN the system SHALL provide UX flow analysis, copywriting effectiveness scores, StoryBrand framework assessment, and competitive positioning insights
3. WHEN landing pages are processed THEN the system SHALL capture page structure, visual elements, and conversion optimization opportunities
4. WHEN landing page processing encounters dynamic content THEN the system SHALL attempt to capture rendered content or provide analysis based on available static elements

### Requirement 6

**User Story:** As a user with unspecified or mixed content types, I want the system to intelligently determine the most appropriate analysis approach and provide relevant insights, so that all saved URLs receive meaningful processing regardless of explicit categorization.

#### Acceptance Criteria

1. WHEN a URL is tagged as "unspecified" or has no content type tag THEN the system SHALL analyze the URL and content to automatically determine the most appropriate pattern chain
2. WHEN content type cannot be determined THEN the system SHALL default to a general analysis pattern chain: extract_wisdom_dm → summarize → extract_main_idea → extract_recommendations
3. WHEN automatic content type detection is used THEN the system SHALL update the Notion page with the detected content type for future reference
4. WHEN general analysis is applied THEN the system SHALL provide broad insights that are valuable regardless of specific content type

### Requirement 7

**User Story:** As a system administrator managing the automation workflow, I want reliable monitoring, error handling, and notification systems, so that the automation runs smoothly and issues are quickly identified and resolved.

#### Acceptance Criteria

1. WHEN the monitoring system runs THEN it SHALL use n8n automation or equivalent polling system to check for new Notion database entries
2. WHEN errors occur during processing THEN the system SHALL log detailed error information and attempt recovery or alternative processing methods
3. WHEN processing completes successfully THEN the system SHALL update the Notion page status and provide completion notifications
4. WHEN system maintenance is required THEN the automation SHALL provide clear status indicators and graceful degradation options

### Requirement 8

**User Story:** As a user managing processed content, I want clear status tracking, progress indicators, and result organization within my Notion database, so that I can easily find and review automated analysis results.

#### Acceptance Criteria

1. WHEN URLs are being processed THEN the system SHALL update Notion page status to indicate processing progress (queued, processing, completed, error)
2. WHEN analysis results are available THEN they SHALL be organized in structured sections within the Notion page (summary, key insights, detailed analysis, recommendations)
3. WHEN multiple pattern chains are executed THEN results SHALL be clearly labeled and organized by analysis type
4. WHEN processing history is needed THEN the system SHALL maintain logs of processing attempts, success rates, and performance metrics