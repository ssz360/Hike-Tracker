RETROSPECTIVE (Team ***15***)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs. done
  - 6 vs 6
- Total points committed vs. done
  - 21 vs 21
- Nr of hours planned vs. spent (as a team)
  - 72 vs 70

**Remember** a story is done ONLY if it fits the Definition of Done:

- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD if required (you cannot remove items!)

### Detailed statistics

| Story | # Tasks | Points | Hours est. | Hours actual |
| ----- | ------- | ------ | ---------- | ------------ |
| #0    | 5       |        | 21         | 18           |
| #1    | 5       | 5      | 4          | 7            |
| #4    | 4       | 8      | 4          | 3            |
| #6    | 3       | 3      | 4          | 5            |
| #7    | 6       | 5      | 14         | 10           |
| #8    | 6       | 3      | 15         | 14           |
| #9    | 3       | 2      | 10         | 12           |


> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task average, standard deviation (estimate and actual) 
- - hours per task average
- - - estimate 2 hours and a half
- - - actual 2 hours and a half
- - standard deviation
- - - estimate 56 minutes
- - - actual 1 hour and 15 minutes

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1
- - 0.043478

  

## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated 6
  - Total hours spent 7
  - Nr of automated unit test cases 38
  - Coverage (if available) 64%
- E2E testing:
  - Total hours estimated 8
  - Total hours spent 9
- Code review
  - Total hours estimated 4
  - Total hours spent 5


## ASSESSMENT

- What caused your errors in estimation (if any)? For story #7 there is quite a divergence between story points and actual time spent with respect to the other stories, and we think it was because we settled with the estimation we have done the first time and we didn't update it, that estimation was done more unconsciously so that's where that difference come from.

- What lessons did you learn (both positive and negative) in this sprint?
  - Less is more: committing a smaller amount of stories made us focus better on the ones we've chosen
  - More testing, as we have seen during the presentation the more that you dig into your product the more issues appear
  - Configuration Management is key: updating the shared work more frequently is really helpful because you can see immediately an implementation that your task may depend on

- Which improvement goals set in the previous retrospective were you able to achieve? Almost all of them but communication about the same story still needs some improvements

- Which ones you were not able to achieve? Why? Communication between members of the same story should improve: also actions that are going to be done need to be told

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)

> Propose one or two

- More mockups need to be made: doing the planning of the interfaces can help avoid misunderstandings
- More testing and more realistic data
- Checking the PO requests more often so that requirements don't get lost
