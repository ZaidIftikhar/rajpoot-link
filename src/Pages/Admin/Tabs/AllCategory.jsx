import React, { useState,Fragment, useEffect } from 'react'
import TopNav from '../../../Components/Admin/TopNav'
import { Link, useNavigate } from 'react-router-dom'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { useDeleteCategoryMutation, useGetCategoryQuery, useGetSingleCategoryMutation, usePostCategoryMutation, useUpdateCategoryMutation } from '../../../Redux/Api/CategoryApi'
import Loading from '../../../Components/Loading'



const renderCategories = (categories,deleteCategory,EditCategory, parentId = null) => { 

  const filteredCategories = categories.filter(category => category.parent === parentId);

  if (filteredCategories.length === 0) {
    return null;
  }
  

  return (
    <div className=''>
      {filteredCategories.map((category,index) => (
        <div className={` w-full ${!(category.parent==null)?'pl-6':""}`}>
        <tr className=' border w-full' key={category._id}>
                <td className="px-4 w-full py-4 text-sm font-medium whitespace-nowrap ">
                  <div className='bg-[#525252] p-1 px-2 rounded'>
                  
                    <h2 className="font-medium text-white ">
                    {!(category.parent==null)?<span className='text-white'>-</span>:''} {category.name}</h2>
                    {/* <p className="text-sm font-normal text-gray-600 dark:text-gray-400">catalogapp.io</p> */}
                  </div>
                </td>
                <td className="px-12 w-full py-4 text-sm font-medium whitespace-nowrap">
                  <div className="inline px-3 py-1 text-sm font-normal rounded-full text-emerald-500 gap-x-2 bg-emerald-100/60 bg-gray-800">
                    {index+1}
                  </div>
                </td>
                <td className="px-4 w-full py-4 text-sm whitespace-nowrap">
                  <div>
                    <h4 className="text-gray-200">{category.name}</h4>
                    {/* <p className="text-gray-500 dark:text-gray-400">Brings all your news into one place</p> */}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">

<Menu as="div" className="overflow-hidden text-left">
<div>
<Menu.Button className="inline-flex w-full justify-center rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
<button className="px-1 py-1 transition-colors duration-200 rounded-lg text-gray-300 hover:bg-gray-100">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
    </svg>
  </button>
</Menu.Button>
</div>
<Transition
as={Fragment}
enter="transition ease-out duration-100"
enterFrom="transform opacity-0 scale-95"
enterTo="transform opacity-100 scale-100"
leave="transition ease-in duration-75"
leaveFrom="transform opacity-100 scale-100"
leaveTo="transform opacity-0 scale-95"
>
<Menu.Items className="absolute z-50 right-28 -mt-20 w-24 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
<div className="px-1 py-1 ">
<Menu.Item>

  <button
    onClick={()=>EditCategory(category._id)}
    className={'hover:bg-black hover:text-white text-gray-900 group flex w-full items-center rounded-md px-2 py-2 text-sm'}
  >
   
    Edit
  </button>
</Menu.Item>
<Menu.Item>
  <Link to={`/category?id=${category.url}`}
    className={` group flex w-full items-center rounded-md px-2 py-2 text-sm`}
  >
    
    View
  </Link>
</Menu.Item>
</div>

<div className="px-1 py-1">
<Menu.Item>
  <button
    onClick={()=>deleteCategory(category._id)}
    className={` group flex bg-red-500 w-full items-center rounded-md px-2 py-2 text-sm`}
  >
    
    Delete
  </button>
</Menu.Item>
</div>
</Menu.Items>
</Transition>
</Menu>
 
</td>
              </tr>
            
        {renderCategories(categories,deleteCategory,EditCategory,category._id)}
              
        {/* <li key={category.id}>
           {category.name}
           {renderCategories(categories, category.id)}
        </li> */}
        </div>
      ))}
    </div>
  );
};



const AllCategory = () => {
  const Navigate = useNavigate()
  const {data,isFetching,isLoading,refetch} = useGetCategoryQuery()
  const [isOpen, setIsOpen] = useState(false)
  const [isEdit,setIsEdit]= useState(false)
  const [loading,setLoading] = useState(false)
  const [category,setCategory] = useState([])
  const [addNewCategory,setAddNewCategory] = useState({
    name:"",
    featured:false,
    image:"",
    parent:""
  })
  const [AddNewPost,result] = usePostCategoryMutation()
  const [GetCategory] = useGetSingleCategoryMutation()
  const [deleteCat] = useDeleteCategoryMutation()
  const [UpdatePost] = useUpdateCategoryMutation()

  const deleteCategory=(id)=>{
    setLoading(true)
    deleteCat(id)
    refetch()
  }
  const EditCategory=async(id)=>{
      setIsEdit(true)
      const res = await GetCategory(id);
      setAddNewCategory({
        id:res.data.data._id,
        name:res.data.data.name,
        featured:res.data.data.featured,
        image:"",
        parent:res.data.data.parent
      })
      openModal()
  }

  useEffect(()=>{
    data?setCategory(data.data):console.log("Fetching Categories")
    setLoading(false)
  },[data])
  
  function closeModal() {
    setAddNewCategory({
      name:"",
    featured:false,
    image:"",
    parent:""
    })
    setIsOpen(false)
    
  }
  function openModal() {
    setIsOpen(true)
  }

  const SubmitModal=async()=>{
    try{
      
      setLoading(true)
      let ind = new FormData()
      if(addNewCategory.name && addNewCategory.image){
        ind.append("name",addNewCategory.name)
        ind.append("fImage",addNewCategory.image)
        ind.append("featured",addNewCategory.featured)
        if(addNewCategory.parent){
          ind.append("parent",addNewCategory.parent)
        }
        AddNewPost(ind)
        setAddNewCategory({
          name:"",
          featured:false,
          image:"",
          parent:""
        })
        // const {data} = await refetch()
        //  console.log("data",data)
        setAddNewCategory({name:"",fImage:"",featured:false,parent:null})
        //  setCategory(data.data)
    setIsOpen(false)
      }else{
        alert("Some Fields are empty")
      }
    }catch(err){
      console.log("Got error in submit indsutry",err)
    }
  }

  const UpdateModal=async(id)=>{
    try{
      setLoading(true)
      let ind = new FormData()
      if(addNewCategory.name){
        ind.append("name",addNewCategory.name)
        if(addNewCategory.image){
          ind.append("fImage",addNewCategory.image)
        }
        ind.append("featured",addNewCategory.featured)
        if(addNewCategory.parent){
          ind.append("parent",addNewCategory.parent)
        }
        UpdatePost({ind,id})
        // const {data} = await refetch()
        //  console.log("data",data)
        setAddNewCategory({name:"",image:"",featured:false,parent:null})
        //  setCategory(data.data)
    setIsOpen(false)
      }else{
        alert("Some Fields are empty")
      }
    }catch(err){
      console.log("Got error in submit indsutry",err)
    }
  }

  const generateOptions = (categories, parentId = null, level = 0) => {
    const filteredCategories = categories.filter(
      (category) => (parentId === null && category.parent === null) || category.parent === parentId
    );

    return filteredCategories.map((category2) => (
      <React.Fragment key={category2._id}>
        <option value={category2._id}>
          {level > 0 && Array(level).fill('\u00A0')} {/* Add indentation for sub-categories */}
          {parentId !== null && '- '} {/* Add a symbol to indicate sub-category */}
          {category2.name}
          {category2.parent && (
            <>
              {' '}
              &rarr; {category.find((c) => c._id === category2.parent).name} {/* Show parent category */}
            </>
          )}
        </option>
        {generateOptions(categories, category2._id, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <>
    <div className='flex justify-center'>
    {loading && 
    <Loading/>
    }
    </div>
    <TopNav/>
    <section className="container px-2 mx-auto py-2">
  <div className="sm:flex sm:items-center sm:justify-between">
    <div>
      <div className="flex items-center gap-x-3">
        <h2 className="text-xl text-gray-800 font-bold">All Category</h2>
        {/* <span className="px-3 py-1 text-xs text-blue-600 bg-blue-100 rounded-full dark:bg-gray-800 dark:text-blue-400">240 vendors</span> */}
      </div>
      {/* <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">These companies have purchased in the last 12 months.</p> */}
    </div>
    <div className="flex items-center mt-4 gap-x-3">

      <button onClick={openModal} className="flex items-center justify-center w-1/2 px-5 py-2 text-sm tracking-wide text-white transition-colors duration-200  rounded-lg shrink-0 sm:w-auto gap-x-2  hover:bg-blue-500 bg-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Add New Category</span>
      </button>
    </div>
  </div>
  <div className="mt-6 md:flex md:items-center md:justify-between">
    <div className="relative flex items-center mt-4 md:mt-0">
      <span className="absolute">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mx-3 text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </span>
      <input type="text" placeholder="Search" className="block w-full py-1.5 pr-5  border rounded-lg md:w-80 placeholder-gray-400/70 pl-11 rtl:pr-11 rtl:pl-5 bg-gray-900 text-gray-300 border-gray-600 focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" />
    </div>
  </div>
  <div className="flex flex-col mt-6">
    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="overflow-hidden border border-gray-700 md:rounded-lg">
          <table className="min-w-full divide-y  divide-gray-700">
           
            <tbody className=" divide-y divide-gray-700 bg-gray-900 overflow-scroll">
            
             {renderCategories(category,deleteCategory,EditCategory)}            
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

</section>

<Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {isEdit?"Update Category":"Add New Category"} 
                  </Dialog.Title>
                  
<form>
  <div className="my-6">
    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name of Category</label>
    <input type="text" value={addNewCategory.name} onChange={(e)=>{setAddNewCategory({...addNewCategory,name:e.target.value})}} id="name" className=" border text-gray-100 text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="standard automation" required />
  </div>
  <div className="mb-6">
    <label htmlFor="file" className="block mb-2 text-sm font-medium text-gray-900">Thumbnail Image - {isEdit && "if not added then previous image will shown (optional)"}</label> 
    <input onChange={(e)=>{setAddNewCategory({...addNewCategory,image:e.target.files[0]})}} type="file" id="file" className=" border text-gray-100 text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-100 focus:ring-blue-500 focus:border-blue-500" required />
  </div>
  <div className="my-6">
    <label htmlFor="parentCat" className="block mb-2 text-sm font-medium text-gray-900">Parent Category</label>
    <select value={addNewCategory.parent} onChange={(e)=>{setAddNewCategory({...addNewCategory,parent:e.target.value})}} id="parentCat" className=" border text-gray-100 text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" required >
    <option value={null}>No Parent</option>
    {generateOptions(category)}    
      {/* {category.map((item)=>(
      <option value={item._id}>
        {item.name}
      </option>
      ))} */}

      
    </select>
  </div>
  <div className="my-6">
    <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Featured</label>
    <select type="text" onChange={(e)=>{setAddNewCategory({...addNewCategory,featured:e.target.value})}} id="name" value={addNewCategory.featured} className=" border text-gray-100 text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500" placeholder="Women Cloths etc." required >
      <option value={true}>Yes</option>
      <option value={false}>No</option>
    </select>
  </div>

                  <div className="mt-4">
                    {!isEdit?(
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={SubmitModal}
                    >
                      Create New Category
                    </button>
                    ): (<button
                      type="button"
                      className="inline-flex justify-center rounded-md border-2 text-white bg-green-500 px-4 py-2 text-sm font-medium  hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={()=>UpdateModal(addNewCategory.id)}
                    >
                      Update Category
                    </button>)}
                  </div>
</form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


</>
  )
}



export default AllCategory


