# Rules for the database triggers

## Introduction 

Database triggers are tricky, because the might trigger a whole sequence of events, there for it's important to control this. Some basic rules

- Triggers only update a single parent or sibling
- Triggers only update something if it's really necessary (only on dirty fields)
- Triggers should be as simple as possible

## Rules

### Users

For users the following:

- Create: 
  - Nothing
- Update: 
   - If isDirty(name) -> Update the users/following
- Delete:
   - Should clean up all the user related stuff 

### Trips

For Trips the following:

- Create:
  - Update User.trips +1
- Update:
  - If isDirty(name) -> Update the users/following
  - If isDirty(recent) -> Update the users/following
  - If isDirty(privacy) -> Update the users/following
- Delete:
  - Update User.trips -1
  - Should clean up all the Trip related stuff

### Trip Users (following trips)

This is currently implemented in a root collection 'trips-users' but will probably move to 'users/trips-following'

- Create:
  - Increment the Trip.followers (is typically created from the client)
- Update:
  - When isDirty(recent), create a notification for the User involved. 
- Delete:
  - Decrement the Trips.followers
  
### Trips/Posts

This is a subcollection of the Posts with the following rules

- Create:
  - Increment the Trips.posts
  - Update the Trips.recent
  - Update the Trips.countries
- Update:
  - Update the Trips.recent
- Delete:
  - Decrement the Trips.posts
  - Update the Trips.recent
  - Delete the media of the post
  - Delete Notification for this post
  - Delete Flag for this post


