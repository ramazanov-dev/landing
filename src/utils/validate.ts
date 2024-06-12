export type ValidationRule =
  | "phoneNumber"
  | "email"
  | "password"
  | "personName"
  | "date"
  | "comment256"
  | "entityId"
  | "integer";

export default function validate(
  rule: ValidationRule,
  entity: unknown,
  displayRuleName?: string
): true | string {
  if(rule === "phoneNumber")
    return (
      (typeof entity === "string" && /\+79\d{9}/.test(entity)) ||
      "Invalid phone number"
    );
  else if(rule === "email")
    return (
      (typeof entity === "string" &&
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(entity)) ||
      "Invalid E-Mail"
    );
  else if(rule === "password")
    return (
      (typeof entity === "string" && /^.{8,64}$/.test(entity)) ||
      "Password can be 8-64 symbols long"
    );
  else if(rule === "personName")
    return (
      (typeof entity === "string" &&
        /[a-zа-яё][a-zа-яё\-]+[a-zа-яё]$/i.test(entity)) ||
      `${displayRuleName} is not valid`
    );
  else if(rule === "date")
    return (
      !isNaN(new Date(entity as string) as never) ||
      `${displayRuleName ?? rule} is not valid`
    );
  else if(rule === "comment256")
    return (
      (typeof entity === "string" &&
        entity.length >= 1 &&
        entity.length <= 256) ||
      `${displayRuleName ?? rule} can be 1-256 symbols long`
    );
  else if(rule === "integer")
    return (
      (typeof entity === "number" && /\d{1,16}/.test(String(entity))) ||
      `${displayRuleName ?? rule} is not valid`
    );
  else
    return `Unknown validation rule ${rule} (${displayRuleName}). Entity: ${entity}`;
}
