import {Select} from "antd";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";


export const SelectAuthors = (props) => {
    const [authors, setAuthors] = useState([])
    const {mainSlice} = useSelector(state => state)

    useEffect(() => {
        setAuthors(mainSlice.authors.map((i) => ({
            value: i.authorFullName,
            key: i.id
        })))
    }, []);

    return (
        <Select options={authors} mode={'multiple'} {...props} />
    )
}