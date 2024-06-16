import {Button, Space} from "antd";
import {TextSong} from "../../components/modals/TextSong";
import {useEffect, useState} from "react";
import {axiosInstance} from "../axiosInstance";


export const SongAdditionalActions = ({song}) => {
    const [currentSong, setSong] = useState('')
    const [cacheSong, setCacheSong] = useState()
    console.log(song)
    const handleSong = async () => {
        if (cacheSong === song.songUri) {
            return null;

        } else {
            await axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net${song.songUri}`, {
                responseType: 'blob'
            })
                .then((res) => {
                    const imageUrl = URL.createObjectURL(res.data)
                    setSong(imageUrl)
                    setCacheSong(song.songUri)
                })
        }
    }

    useEffect(() => {
        handleSong()
    }, []);

    const getSongNotes = async () => {
        await axiosInstance.get(`https://dligjs37pj7q2.cloudfront.net${song.notesUri}`, {
            responseType: 'blob'
        })
            .then((res) => {
                const imageUrl = URL.createObjectURL(res.data)
                const link = document.createElement('a');
                link.href = imageUrl;
                link.setAttribute('download', 'note.mid');
                document.body.appendChild(link);
                link.click();
                link.remove()
            })
    }

    return (
        <Space direction={'vertical'}>
            <audio class="custom-audio" controls src={currentSong} />
            <Button onClick={() => getSongNotes()}>Скачать ноты</Button>
            <TextSong url={song.songTextUri} />
        </Space>
    )
}