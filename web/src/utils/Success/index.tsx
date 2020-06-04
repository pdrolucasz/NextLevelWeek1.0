import React from 'react'
import { FiCheckCircle } from 'react-icons/fi'

const Success = () => {
    return (
        <div className="success">
            <span>
                <FiCheckCircle />
            </span>
            <h2>Cadastro concluído!</h2>
        </div>
    )
}

export default Success