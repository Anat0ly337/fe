import {Select} from "antd";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {apiRequests} from "../api";
import debounce from "../utils/debounce";


export const SelectAlbum = (props) => {
    const [data, setData] = useState([])
    const {mainSlice} = useSelector(state => state)

    useEffect(() => {
        setData(mainSlice.albums.map(i => ({
            value: i.name,
            key: i.id
        })))
    }, []);

    const searchHandler = async (value) => {
        if (value === '') {
            await apiRequests.media.allAlbums()
                .then((res) => {
                    setData(res.data.authors.map((i) => ({
                        value: i.name,
                        key: i.id
                    })))
                })
        } else {
            const searchedItems = data.filter((i) => i.value.includes(value))

            if (searchedItems.length === 0) {
                await apiRequests.albums.getByName(value)
                    .then((res) => {
                        setData(res.data.map((i) => ({
                            value: i.name,
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
        <Select showSearch onSearch={(val) => handleSearch(val)} options={data} {...props} />
    )
}