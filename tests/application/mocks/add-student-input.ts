import { AddStudentUseCase } from "../../../src/domain/useCases";

export const makeFakeStudentInput = (): AddStudentUseCase.Props => ({
    name: "any_name",
    age: 20,
    password: "any_password"
})