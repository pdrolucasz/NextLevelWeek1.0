import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import api from '../../services/api'

interface Data {
    point: {
        name: string
        email: string
        whatsapp: string
        city: string
        uf: string
        image: string
        image_url: string
    },
    items: {
        title: string
    }[]
  }

const PointDetails = () => {

    const [ detail, setDetail ] = useState<Data>({} as Data)

    const { id } = useParams()

    useEffect(() => {
        api.get(`/points/${id}`).then(response => {
            setDetail(response.data)
        })
    }, [])

    return (
        <h1>{detail.point.name}</h1>
    )
}

export default PointDetails