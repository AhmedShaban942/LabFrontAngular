import { Claim } from "./Claim";

// models/Role/GroupedClaims.ts
export interface GroupedClaims {
  module: string;       // مثل ManageUsers, ManageRoles
  claims: Claim[];
}
