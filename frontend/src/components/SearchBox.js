import React,{useState} from 'react'
import {Form,Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

const SearchBox = () => {
    const [keyword,setKeyword] = useState('')
    const navigate = useNavigate()

 const submitHandler = (e)=>{
        e.preventDefault()
        //trim - removes blank space(__)
        if(keyword){
            navigate(`/search/${keyword.trim()}`)
            setKeyword('')
        }
        else{
            navigate('/')
        }
    }

    return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control 
        type='text' 
        name='q'
        onChange={(e)=>setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Products...'
        className='mr-sm-1 ml-sm-1'>
     </Form.Control>
        <Button 
        type='submit'
        variant='outline-success'
        className='p-2 mx-2'>
            Search
        </Button>
    </Form>
  )
}

export default SearchBox