import {DateTime} from "luxon";

export default interface UserModel {
  _id: string;
  phoneNumber: string;
  email: string;
  passwordHash: string;

  title: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: DateTime | null;
  placeOfBirth: string;
  citizenship: string | null;
  taxNumber: string;
  taxResidency: string | null;
  passportNumber: string;
  passportCreatedByCountry: string | null;
  passportCreatedAt: DateTime | null;
  passportExpiryDate: DateTime | null;

  permanentAddress: {
    country: string | null;
    city: string;
    street: string;
    buildingNumber: string;
    apartmentNumber: string;
    zipCode: string;
  } | null;

  residentialAddress: {
    country: string | null;
    city: string;
    street: string;
    buildingNumber: string;
    apartmentNumber: string;
    zipCode: string;
  } | null;

  proofOfIdentityFile: string | null;
  proofOfAddressFile: string | null;
  proofOfPersonalityFile: string | null;
  proofOfSoiFile: string | null;
  proofOfTaxDeclarationFile: string | null;

  soiCountry: string | null;
  annualRevenue: string;
  soiString: string;
  soiArray: string[];
  soiDescription: string;
}
