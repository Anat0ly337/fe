import { useMemo, useState } from "react";
import { axiosInstance } from "../axiosInstance";
import { Image } from "antd";


const ImageColumn = ({id}) => {
    const [urlImage, setUrlImage] = useState('')
    useMemo(() => {
        if (typeof id === 'object') {
            axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net${id.url}`, {
                responseType: 'blob'
            })
                .then((data) => {
                    const imageUrl = URL.createObjectURL(data.data)
                    setUrlImage(imageUrl)
                })
        } else {
            axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net/api/v1/media/${id}`, {
                responseType: 'blob'
            })
                .then((data) => {
                    const imageUrl = URL.createObjectURL(data.data)
                    setUrlImage(imageUrl)
                })
        }
        
    }, [])

  return (
    <>
        <Image width={120} src={urlImage} />  
    </>
  )
};

export default ImageColumn;
