import Styled from 'styled-components'
import {Link} from 'react-router-dom'

export const LinkItem = Styled(Link)`
    color:${props => props.color};
`
export const LinkDetailsContainer = Styled.div`
color : ${props => props.color};`
