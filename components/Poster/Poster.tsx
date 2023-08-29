import React from 'react';
import { useState } from 'react';
import { Fragment } from 'react'
import Modal from '@/components/Poster/Modal'
import '@/components/Poster/style.scss'

export default function Poster() {
    const [showModal, setShowModal] = React.useState(false);
    return (
        <Fragment>
            <Modal isVisible={showModal}>
                <button className='poster-button w-[809px] h-[64px] bg-medium-gray text-darker-white text-xl text-left rounded-[8px] pl-8 hover:text-medium-primary mt-8 mb-8' onClick={() => setShowModal(true)}>
                    Faça uma publicação
                    <div className='w-[14px] h-[2px] bg-darker-white hover:bg-medium-primary hover:grow'></div>
                </button>
            </Modal>
        </Fragment>
    )
}