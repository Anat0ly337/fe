import { Flex, Table, Tag } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SongsTable } from "../../components/tables/Songs";
import Title from "antd/es/typography/Title";





const SongsOfCollection = () => {
    const [songs, setSongs] = useState([])
    const [titleCollection, setTitle] = useState('')
    const {id} = useParams()
    const {mainSlice} = useSelector(state => state)

    useEffect(() => {
        const currentCollection = mainSlice.collection.find(i => i.id == id)
        
        if (currentCollection) {
            setTitle(currentCollection.name)
            setSongs(currentCollection.songs)
        }

    }, [id])

  return (
    <>
        <Title>{titleCollection}</Title>
      <SongsTable
                    handleTable={() => {}}
                    isLoading={false}
                    songs={songs}
                    additionalColumns={[
                        {
                            title: 'Теги',
                            dataIndex: 'tags',
                            key: 'tags',
                            render: (_, record) => {
                                const tags = record.tags?.split(',').filter((i) => i !== '')
                                if (tags && tags.length > 0) {
                                    return (
                                        <Flex wrap={'wrap'} gap={6}>
                                            {
                                                tags.map((i) => (
                                                    <Tag color={'geekblue'}>{i}</Tag>
                                                ))
                                            }
                                        </Flex>
                                    )
                                }
                            }
                        },
                        {
                            title: 'Название файла',
                            dataIndex: 'tags',
                            key: 'tags',
                            render: (_, record) => <Paragraph>{record.originalFileName}</Paragraph>
                        }
                    ]}
                    deleteHandler={() => {}}
                    pagination={{}}
                    updateHandler={() => {}}
                    setSongs={setSongs}
                    />
    </>
  )
};

export default SongsOfCollection;
