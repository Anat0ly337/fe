import {useEffect, useMemo, useState} from "react";
import {apiRequests} from "../../shared/api";
import {getCurrentMonth} from "../../shared/utils/getCurrentMonth";
import dayjs from "dayjs";
import {Card, Space, Table} from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Holders from "../../pages/Holders/Holders";


export const MoneyDistribution = ({date}) => {
    const [wholeSum, setSum] = useState({
        sum: 0,
        percentSum: 0
    })

    useEffect(() => {
        apiRequests.statistics.moneyDistribution()
            .then((res) => {
                setSum({
                    percentSum: res.data.percentSum,
                    sum: res.data.commonSumm
                })
            })

    }, []);

    return (
        <>
            <Card style={{marginBottom: '20px'}} size={"small"} title={'Данные о доходе'}>
                <Paragraph>Доход от подписок: {wholeSum.sum}</Paragraph>
                <Paragraph>Процент авторам: {wholeSum.percentSum}</Paragraph>
            </Card>
            <Holders />
        </>
    )
}