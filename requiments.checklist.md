# Game Server Developer

## Part 1 - User 
Create a service that exposes the following functionalities: 
* User creation and authentication (a simple UUID string is sufficient) :ballot_box_with_check:
* Every user has a wallet with two currencies: hard_currency & soft_currencies :ballot_box_with_check:
* Every time a new user is created, its wallet is initialized with the following parameters: :ballot_box_with_check:
    * hard_currency: random number from 5 to 100
    * soft_currency: random number from 10 to 1.000
* AddCurrency: this function is used for testing purposes and is not available to the user. It adds an amount of currency to the user's wallet. :ballot_box_with_check:

## Part 2 - Clubs
Think about a data structure to map the functionality of a Club (a group of users). Please consider any possible issues with the provided features and make the necessary assumption to avoid them. 
The actions available to the users are the following: 
* CreateClub: the user can create a Club, which is a group of users. Every club has a maximum number of members (default: 50). When creating a club, the user spends 50 hard_currency; :ballot_box_with_check:
* JoinClub: the user can join an existing club by sending the club id. If the maximum number of members is already reached an error must be returned to the user. When successfully joining a club the user spends 100 soft_currency :ballot_box_with_check:
* ListClubs: it returns a list of existing clubs :ballot_box_with_check:
* GetClub: given the club id, it returns the details of a single club :ballot_box_with_check:
* SendMessage: the user can send a message to its club :ballot_box_with_check:
* GetClubMessages: it returns the list of messages shared in the club :ballot_box_with_check:

## Part 3 - Club donations :construction:

We want to implement a Donation feature for the Club system, with the following functionalities:  
* Any club member can issue a donation request to its club: donation is an exchange of soft_currency between members of the same club.
* Any club member can donate their soft_currency to a specific donation request
* When a donation request is fulfilled the soft_currency is transferred to the request issuer

Think about the feature and create your own design for it. Write down all assumption made during the design process and develop the necessary API endpoints.

## OUTPUT
* Node.js project + typescript
* DB structure
* Query to create & setup the DB
* Setup scripts and starting scripts (preferably docker compose)


