    import { faker } from '@faker-js/faker';

export interface EmployeeData {
  firstName: string;
  lastName: string;
  employeeId: string;
  otherId: string;
}

export function generateEmployeeData(): EmployeeData {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    employeeId: `EMP${Date.now().toString().slice(-6)}`,
    otherId: `OTH-${faker.number.int({ min: 1000, max: 9999 })}`,
  };
}