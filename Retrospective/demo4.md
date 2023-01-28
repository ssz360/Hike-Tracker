TEMPLATE FOR RETROSPECTIVE (Team 15)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done 3 vs 3 
- Total points committed vs done 13 vs 13
- Nr of hours planned vs spent (as a team) 72 vs 73

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   | 17      |    -   |  46        |    44.3      |
| 17     | 8       | 8      |  12.5      |    14.5      |
| 18     | 3       | 2      |  5         |    6.5       |
| 33     | 4       | 3      |  7.75      |    7.5       |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)
    - average
        - estimated 2,26
        - actual 2,27
    - standard deviation 
        - estimated 1,20
        - actual 1,24
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent -1
    - -0.007
    

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated 5
  - Total hours spent 6
  - Nr of automated unit test cases 105
  - Coverage (if available) 74%
- E2E testing:
  - Total hours estimated 7.5
  - Total hours spent 8
- Code review 
  - Total hours estimated 6
  - Total hours spent 5
- Technical Debt management:
  - Total hours estimated 9
  - Total hours spent 4 hours and 15 minutes
  - Hours estimated for remediation by SonarQube 60
  - Hours estimated for remediation by SonarQube only for the selected and planned issues 7.5
  - Hours spent on remediation 4
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 1.1%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  - - reliability A (0 bugs)
  - - security A (0 vulnerabilities)
  - - maintanability  A (411 code smells against 552 code smells of last sprint)
  


## ASSESSMENT

- What caused your errors in estimation (if any)?

    - 

- What lessons did you learn (both positive and negative) in this sprint?

    - We should ask more to the PO to develop features not strictly required

    - Check more the FAQs and requirements since some of them were missed during the deployment (start hike is only for hikers)

    - Using polls to assign tasks is a good way to see everybody's preferences 

- Which improvement goals set in the previous retrospective were you able to achieve? 

    - Trying to be on pair with technical debt and have more mantainable code, we planned a task for code maintenability

    - We wrote a bigger amount of tests but we didn't cover much edge cases

- Which ones you were not able to achieve? Why?

    - We were not able to complete almost all the work few days before 
    
    - We were not able to fulfill our hope to build more and more diverse automated test cases, we built only the necessary ones

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> Propose one or two

    - Being able to have everything done 2 or 3 days before the presentation

    - Trying to balance more the aesthetic part with the functional part (completing more stories)

- One thing you are proud of as a Team!!

    - Though the project was hard and time consuming we will miss these days as a team 