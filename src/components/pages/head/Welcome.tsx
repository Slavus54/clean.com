import React, {useState, useEffect} from 'react'
import Centum from 'centum.js'
import features from '../../../env/features.json'
import {PROJECT_TITLE} from '../../../env/env'
import {init} from '../../../store/storage'
import NavigatorWrapper from '../../router/NavigatorWrapper'

const Welcome: React.FC = () => {
    const [cards, setCards] = useState(null)
    const centum = new Centum()
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(el => {
            el.target.classList.toggle('card', el.isIntersecting)
        })
    }, {threshold: 0.2})

    useEffect(() => {
        init()

        const data = document.querySelectorAll('.item')

        setCards(data)

        centum.title('Welcome', PROJECT_TITLE)
    }, [])

    if (cards) {
        cards.forEach(el => {
            observer.observe(el)
        })
    }

    return (
        <>    
            <h1>Clean.com</h1>
            <h4 className='pale'>Project for ARCHITECTURE & ECOLOGY lovers!</h4>
        
            <NavigatorWrapper isRedirect={false} url='/register'>
                <button className='light'>Start</button>
            </NavigatorWrapper>

            <h1>Features</h1>

            <div className='items small'>
                {features.map(el => 
                    <div className='item cardance'>
                        <h3>{el.title}</h3>
                        <p className='pale text'>{el.content}</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default Welcome