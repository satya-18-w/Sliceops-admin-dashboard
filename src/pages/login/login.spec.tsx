import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react"
import Login from "./login";

describe("Login Page", () => {
    it("should render with required fields", () => {
        // AAA -> Arrange, Act, Assert
        render(<Login />)
        // getBy - > trroughs an error
        // findBy - > async
        // queryBy - > return null  not error
        expect(screen.getByText("LoginPage")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
        expect(screen.getByRole("checkbox", { name: "Remember me" })).toBeInTheDocument();
        expect(screen.getByText("Forgot Password")).toBeInTheDocument();





    })
})
