import {Select} from "antd";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiRequests} from "../api";
import debounce from "../utils/debounce";


export const SelectHolders = (props) => {
    const [data, setData] = useState([])
    const {mainSlice} = useSelector(state => state)

    useEffect(() => {
        setData(mainSlice.holders.map((i) => ({
            value: i.holderFullName,
            key: i.id
        })))
    }, []);

    const searchHandler = async (value) => {
        if (value === '') {
            setData(mainSlice.holders.map((i) => ({
                value: i.holderFullName,
                key: i.id
            })))
        } else {
            const searchedItems = data.filter((i) => i.value.includes(value))

            if (searchedItems.length === 0) {
                await apiRequests.holders.getByName(value)
                    .then((res) => {
                        setData(res.data.map((i) => ({
                            value: i.holderFullName,
                            key: i.id
                        })))
                    })
            } else {
                setData(searchedItems)
            }
        }
    }

    const handleSearch = debounce(searchHandler, 650)

    return (
        <Select showSearch options={data} onSearch={(val) => handleSearch(val)} {...props} />
    )
}