TEMPLATE FOR RETROSPECTIVE (Team 15)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 
- Total points committed vs done 
- Nr of hours planned vs spent (as a team)

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   | 16      |    -   | 47.5       |  45.5        |
| 10     | 6       | 3      | 12.5       |  12          |
| 11     | 2       | 2      | 6          |  5           |
| 33     | 5       | 5      | 9.5        |  9.5         |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
    - average
        - estimated 2 hours and a half
        - actual 2 hours and a half
    - standard deviation 
        - estimated 1 hour and 10 minutes
        - actual 1 hour and a half
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1
    - 0.049

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated 6
  - Total hours spent 5
  - Nr of automated unit test cases 95
  - Coverage (if available)
- E2E testing:
  - Total hours estimated 6
  - Total hours spent 4
- Code review 
  - Total hours estimated 6
  - Total hours spent 3
- Technical Debt management:
  - Total hours estimated 5 
  - Total hours spent 5
  - Hours estimated for remediation by SonarQube 62
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 3.5
  - Hours spent on remediation 4
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 1.8%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  - - reliability A (0 bugs)
  - - security A (0 vulnerabilities)
  - - maintanability  A (552 code smells)
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

    - The only errors are about the story points that were assigned way before the planning

- What lessons did you learn (both positive and negative) in this sprint?

    - We have to focus more on testing in general

    - Quality over quantity

    - Doing planning as soon as possible to be able to have the full time to divide the work better during the sprint

    - Having a clear idea of how the interface should look like speeds up the work by a huge margin

- Which improvement goals set in the previous retrospective were you able to achieve? 

    - Communication and integration were much better in this sprint

    - More mockups were developed immediately

    - More manual testing and more realistic data that helped in the achievement of a better presentation

    - We also were able to get POs request in a faster way
  
- Which ones you were not able to achieve? Why?

    - We were not able to fulfill our hope to build more and more diverse automated test cases, we built only the necessary ones

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> Propose one or two

    - Trying to be on par with technical debt and have more mantainable code

    - Being able to have everything done 2 or 3 days before the presentation

    - More automated test for edge cases

- One thing you are proud of as a Team!!

    - The final result of our product

    - Health of our members
