// This is (some of) the code for the WebSession concept which was introduced in lecture on 9/18.
// We're storing the user (in the form of the username string for now) when the user logs in, and we 
// reset the session's user when the user logs out.

import { SessionData } from "express-session";
import { UnauthenticatedError } from "./errors";

export type WebSessionDoc = SessionData;

// Here, we're overloading the Express session data type so it has the data we need for our app. Right now,
// that's just the user.
declare module "express-session" {
  export interface SessionData {
    // This will not be our final implementation! Starting next week, we will have a User concept with a
    // more rigorous implementation than a string representing the username.
    user?: string;
  }
}

export default class WebSessionConcept {
  // Concept actions

  start(session: WebSessionDoc, username: string) {
    // In Express, the session is created spontaneously when the connection is first made, so we do not need
    // to explicitly allocate a session; we only need to keep track of the user.
    
    this.isNotActive(session);
    session.user = username;
  }

  getUser(session: WebSessionDoc) {
    this.isActive(session);
    return session.user!;
  }

  end(session: WebSessionDoc) {
    // We make sure the user is logged in before allowing the end action.
    this.isActive(session);
    session.user = undefined;
  }

  // Helper functions
  isActive(session: WebSessionDoc) {
    if (session.user === undefined) {
      throw new UnauthenticatedError("Not logged in!");
    }
  }

   isNotActive(session: WebSessionDoc) {
    if (session.user !== undefined) {
      throw new UnauthenticatedError("Not logged out yet!");
    }
  }
}
