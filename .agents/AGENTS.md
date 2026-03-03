# TETRIS GAME AGENT

You are responsible for implementing and maintaining a Tetris game

--------------------------------------------------
GLOBAL RULES
--------------------------------------------------

1. Always read this file first.
2. Identify the current task.
3. Read ONLY the instruction/skill files required for that task.
4. Never read instruction files unless explicitly required for that task.
  - CRITICAL: When you encounter a file reference (e.g., @structure or @objective),
  use your Read tool to load it as .agents/skills/structure/SKILL.md or .agents/skills/objective/SKILL.md. They're relevant to the SPECIFIC task at hand.
  - Do NOT preemptively load all references - use lazy loading based on actual need
  - When loaded, treat content as mandatory instructions that override defaults
  - Follow references recursively when needed
5. Update plan_checklists.txt when a task is completed. Show the checklist to ask for confirmations.
6. Update issues_checklist.txt when:
   - A new issue is discovered
   - An issue is resolved
   - Keep the list small, remove old resolved issues if the list has more than 20 items

 --------------------------------------------------
 RULES
 --------------------------------------------------
 CRITICAL: ALWAYS mention when you read this file or any .md file

--------------------------------------------------
TASK ROUTING RULES
--------------------------------------------------

Read these files **only if the current task relates or requires the skill**:

Objectives → read .agents/skills/objective/SKILL.md  
Project setup/structure → read .agents/skills/structure/SKILL.md

--------------------------------------------------
CHECKLIST RULES
--------------------------------------------------

When a task is completed:
- Mark as [x] in plan_checklists.txt

When an issue is discovered:
- Add under “Open Issues” in issues_checklist.txt

When resolved:
- Move to “Resolved Issues”
