import { render, screen } from "@testing-library/react";
import SongsOfHolders from "../pages/Holders/SongsOfHolders";
import axios from "axios";
import { axiosInstance } from "../shared/axiosInstance";

jest.mock("axios");




describe('Test song of author', () => {
    test('render song of author', () => {
        beforeEach(() => {
            axios.create = jest.fn(() => axiosInstance);
        
            axios.get.mockImplementation((url) => {
            return Promise.resolve({
                data: [],
            });
        });
        });
        render(
            <SongsOfHolders>

            </SongsOfHolders>
        )

        expect(screen.getByText('input')).toBeInTheDocument()
    })
})