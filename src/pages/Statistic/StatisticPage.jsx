import {Button, DatePicker, Form, Tabs} from "antd";
import {PopularSongs} from "../../components/tables/PopularSongs";
import {SungSongs} from "../../components/tables/SungSongs";
import {SongSearchAnalytic} from "../../components/tables/SongSearchAnalytic";
import {SearchOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {useState} from "react";
import {getCurrentMonth} from "../../shared/utils/getCurrentMonth";
import {SongSearchNotResult} from "../../components/tables/SongSearchNotResult";
import {DeviceActivity} from "../../components/tables/DeviceActivity";
import {MoneyDistribution} from "../../components/tables/MoneyDistribution";


const StatisticPage = () => {
    const { RangePicker } = DatePicker
    const [date, setDate] = useState(false)
    const handleDate = (val) => {
        if (!val.date) {
            const {date_to, date_from} = getCurrentMonth()

            setDate({
                dateFrom: dayjs(new Date(date_from * 1000)).format('YYYY-MM-DD'),
                dateTo: dayjs(new Date(date_to * 1000)).format('YYYY-MM-DD')
            })
        } else {
            const dateFrom = dayjs(val.date[0]).format('YYYY-MM-DD')
            const dateTo = dayjs(val.date[1]).format('YYYY-MM-DD')

            setDate({
                dateFrom, dateTo
            })
        }

    }

    const tabItems = [
        {
            label: 'Спетые треки',
            key: '1',
            children: <SungSongs date={date} />,
        },
        {
            label: 'Популярные треки',
            key: '2',
            children: <PopularSongs date={date} />,
        },
        {
            label: 'Успешные запросы',
            key: '3',
            children: <SongSearchAnalytic date={date} />,
        },
        {
            label: 'Неудачные запросы',
            key: '4',
            children: <SongSearchNotResult date={date} />,
        },
        {
            label: 'Активность устройств',
            key: '5',
            children: <DeviceActivity date={date} />,
        },
        {
            label: 'Распределение денег',
            key: '6',
            children: <MoneyDistribution date={date} />,
        }
    ]

    return (
        <>
            <Form onFinish={handleDate} layout={'inline'}>
                <Form.Item name={'date'}>
                    <RangePicker />
                </Form.Item>
                <Form.Item>
                    <Button type={'primary'} htmlType={'submit'} icon={<SearchOutlined />}>Найти</Button>
                </Form.Item>
            </Form>
            <Tabs
                defaultActiveKey={1}
                items={tabItems}
            />
        </>
    )
}

export default StatisticPage