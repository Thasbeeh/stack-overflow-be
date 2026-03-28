import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'ConfirmPassword', async: false })
export class ConfirmPasswordValidator implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        return value === (args.object as Record<string, any>)['password'];
    }

    defaultMessage(): string {
        return 'Password should match.'
    }
}