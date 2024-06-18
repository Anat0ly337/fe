import {AutoComplete, Select} from "antd";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiRequests} from "../api";
import debounce from "../utils/debounce";


export const SelectAuthors = (props) => {
    const [authors, setAuthors] = useState([])
    const {mainSlice} = useSelector(state => state)

    useEffect(() => {
        setAuthors(mainSlice.authors.map((i) => ({
            value: i.authorFullName,
            key: i.id
        })))
    }, []);

    const searchHandler = async (value) => {
        if (value === '') {
            await apiRequests.media.allAuthors()
                .then((res) => {
                    setAuthors(res.data.authors.map((i) => ({
                        value: i.authorFullName,
                        key: i.id
                    })))
                })
        } else {
            const searchedItems = authors.filter((i) => i.value.includes(value))

            if (searchedItems.length === 0) {
                await apiRequests.authors.getByName(value)
                    .then((res) => {
                        setAuthors(res.data.map((i) => ({
                            value: i.authorFullName,
                            key: i.id
                        })))
                    })
            } else {
                setAuthors(searchedItems)
            }
        }

    }

    const handleSearch = debounce(searchHandler, 650)

    return (
        <Select options={authors} onSearch={(val) => handleSearch(val)} mode={'multiple'} {...props} />
    )
}