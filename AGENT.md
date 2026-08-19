항상 모든 답변은 한국어로 말해


GOOGLE ANTIGRAVITY AGENT PERFORMANCE & TOKEN-OPTIMIZATION RULESET
SECTION 1. STRICT TOOL BOUNDARIES & CAPABILITY RESTRICTIONS
1.1. BANNED TOOLS:
- DO NOT invoke browser-driving tools, automated DOM tree analysis, or visual layout inspectors.
- DO NOT capture viewport screenshots or generate browser session recordings under any circumstance.
- DO NOT execute commands that render headless browsers (e.g., Puppeteer, Playwright) with inline visual payload dumping.
1.2. ALLOWED EXECUTION CLI:
- Standard non-interactive shell commands ARE PERMITTED: npm test, vitest, pytest, eslint, ruff, tsc.
- ALL validation must be driven exclusively via terminal stdout/stderr status codes and text-based test outputs.
1.3. HUMAN DELEGATION:
- Visual layout inspection, pixel-perfect alignment, and UI/UX aesthetic evaluation are DELEGATED ENTIRELY TO THE HUMAN USER.
- The Agent's boundary ends at verifying AST correctness, structural HTML/Tailwind/CSS semantics, and passing CLI suites.

SECTION 2. SURGICAL CODE MODIFICATION STANDARDS
2.1. PATCH EDITS ONLY:
- Full-file rewrites are STRICTLY PROHIBITED for any file exceeding 30 lines of code.
- You MUST apply changes using targeted unified diff patches or precise block replacements.
- Retain exact indentation and modify ONLY the lines necessary to fulfill the requirement.
2.2. FILE READ EFFICIENCY:
- DO NOT re-read files that have already been loaded into the active session context unless modified by an external process.
- Inspect only targeted line ranges when reading large source files.
2.3. TYPING & QUALITY BAR:
- Strict TypeScript typing is MANDATORY (noExplicitAny: true). Never introduce any or ignored lint warnings.
- Python code MUST include full type annotations (mypy compliant) and follow standard PEP8 conventions.

SECTION 3. WORKSPACE SCOPING & EXPLORATION DIRECTIVES
3.1. SEARCH CONSTRAINTS:
- DO NOT perform recursive, unconstrained workspace file tree scans (e.g., find ., ls -R).
- You MUST locate files using targeted symbol lookups or restricted grep / ripgrep queries against specific directories.
3.2. EXCLUSION ZONES:
- Never inspect or parse files within: node_modules/, dist/, .git/, coverage/, build/, or binary asset folders.
3.3. GRAPHRAG & HEAVY-DATA HANDLING:
- DO NOT load raw database dumps, large Cypher/SPARQL schema payloads, or massive JSON graph datasets into context.
- Work strictly with abstract interface definitions or execute external CLI helper scripts to validate query syntax.

SECTION 4. TOKEN-PRESERVING COMMUNICATION PROTOCOL
4.1. NO CONVERSATIONAL FLUFF:
- OMIT ALL conversational pleasantries, introductory remarks, apologetic phrasing, or meta-commentary (e.g., "Sure, I can help", "I will now edit...").
- Proceed IMMEDIATELY to action or standard concise response formatting.
4.2. BRIEF STATUS REPORTING:
- Provide response summaries strictly using the format below:
- Files Modified: List of relative paths.
- Verification Command: Exact CLI command executed and exit status code.
- Diff Summary: Concise overview of logic changes (1-3 sentences max).
4.3. CODE BLOCK DUPLICATION BAN:
- DO NOT repeat unchanged code blocks in your final explanations.
- Output ONLY the modified diff snippet or patch block.

SECTION 5. VERIFICATION & EXECUTION WORKFLOW
5.1. CYCLE PROTOCOL:
- Step 1: Identify targets via precise grep / symbol search.
- Step 2: Apply surgical patch edit to code files.
- Step 3: Run headless CLI test/linter suite.
- Step 4: Report status concisely and request human visual review if UI components were structurally altered.