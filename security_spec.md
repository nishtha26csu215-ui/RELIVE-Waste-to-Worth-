# Security Specification

## 1. Data Invariants
- `users/{userId}`: Must match the authenticated user's ID or be managed by the account owner. Must contain valid string lengths for name, email, phone, and address details.
- `orders/{orderId}`: Each order must belong to a valid `userId`, specify who is picking it up (`targetName`), where the pickup occurs (`pickupAddress`), date and time slot, and payment information.
- A user can only access and modify their own orders and profile documents.

## 2. Dirty Dozen Payloads & Edge Cases
1. Setting userId to another user's UID to read their orders.
2. Injecting a 2MB string into `pickupAddress` or `notes` to cause resource exhaustion.
3. Overwriting `points` directly with a negative number or non-numeric type.
4. Setting payment status to invalid enum value.
5. Missing required fields `itemName`, `date`, `timeSlot`, or `pickupAddress`.
6. Modifying an order created by another account.
7. Spoofing collector credentials in an order.
8. Injecting invalid document ID with malicious characters.
9. Deleting orders belonging to other users.
10. Creating user documents with blank name or invalid email format.
11. Updating immutable order IDs after initial creation.
12. Creating orders with invalid order lifecycle statuses.
