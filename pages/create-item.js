/* pages/create-item.js */
import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }
  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()
    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
    router.push('/')
  }



  return (

    <div className="no-bottom no-top" id="content">
            <div id="top"></div>
            
            <section id="subheader">
                    <div className="center-y relative text-center">
                        <div className="container">
                            <div className="row">
                                
                                <div className="col-md-12 text-center">
                  <h1>Create</h1>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </div>
            </section>
            <section aria-label="section">
                <div className="container">
                    <div className="row wow fadeIn">
                        <div className="col-lg-7 offset-lg-1">
                            <div className="field-set">
                                    <h5>Upload file</h5>

                                    <div className="d-create-file">
                                        <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                                        <input type="button" id="get_file" className="btn-main" value="Browse"/>
                                        <input type="file" id="upload_file" onChange={onChange}/>
                                        {
                                          fileUrl && (
                                            <img className="rounded mt-4" width="350" src={fileUrl} />
                                          )
                                        }
                                    </div>


                                    <div className="spacer-single"></div>

                                    <h5>Select method</h5>
                                    <div className="de_tab tab_methods">
                                        <ul className="de_nav">
                                            <li className="active"><span><i className="fa fa-tag"></i>Fixed price</span>
                                            </li>
                                            <li><span><i className="fa fa-hourglass-1"></i>Timed auction</span>
                                            </li>
                                            <li><span><i className="fa fa-users"></i>Open for bids</span>
                                            </li>
                                        </ul>

                                        <div className="de_tab_content">

                                            <div id="tab_opt_1">
                                                <h5>Price</h5>
                                                <input type="text" name="item_price" id="item_price" className="form-control" placeholder="enter price for one item (ETH)" onChange={e => updateFormInput({ ...formInput, price: e.target.value })}/>
                                            </div>

                                            <div id="tab_opt_2">
                                                <h5>Minimum bid</h5>
                                                <input type="text" name="item_price_bid" id="item_price_bid" className="form-control" placeholder="enter minimum bid" />

                                                <div className="spacer-10"></div>

                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h5>Starting date</h5>
                                                        <input type="date" name="bid_starting_date" id="bid_starting_date" className="form-control" min="1997-01-01" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <h5>Expiration date</h5>
                                                        <input type="date" name="bid_expiration_date" id="bid_expiration_date" className="form-control" />
                                                    </div>
                                                    <div className="spacer-single"></div>
                                                </div>
                                            </div>

                                            <div id="tab_opt_3">
                                            </div>

                                        </div>

                                    </div>

                                    <h5>Title</h5>
                                    <input type="text" name="item_title" id="item_title" className="form-control" placeholder="e.g. 'Crypto Funk" onChange={e => updateFormInput({ ...formInput, name: e.target.value })} />

                                    <div className="spacer-10"></div>

                                    <h5>Description</h5>
                                    <textarea data-autoresize name="item_desc" id="item_desc" className="form-control" placeholder="e.g. 'This is very limited item'" onChange={e => updateFormInput({ ...formInput, description: e.target.value })}/>

                                    <div className="spacer-10"></div>

                                    <h5>Royalties</h5>
                                    <input type="text" name="item_royalties" id="item_royalties" className="form-control" placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%" />

                                    <div className="spacer-single"></div>
                                    <button onClick={createMarket} className="">
                                    Create Digital Asset
                                    </button>

                                    
                                </div>
                        </div>

                        <div className="col-lg-3 col-sm-6 col-xs-12">
                                <h5>Preview item</h5>
                                <div className="nft__item">
                                    <div className="de_countdown" data-year="2021" data-month="9" data-day="16" data-hour="8"></div>
                                    <div className="author_list_pp">
                                        <a href="#">                                    
                                            <img className="lazy" src="images/author/author-1.jpg" alt=""/>
                                            <i className="fa fa-check"></i>
                                        </a>
                                    </div>
                                    <div className="nft__item_wrap">
                                        <a href="#">
                                            <img src="images/collections/coll-item-3.jpg" id="get_file_2" className="lazy nft__item_preview" alt=""/>
                                        </a>
                                    </div>
                                    <div className="nft__item_info">
                                        <a href="#">
                                            <h4>Pinky Ocean</h4>
                                        </a>
                                        <div className="nft__item_price">
                                            0.08 ETH<span>1/20</span>
                                        </div>
                                        <div className="nft__item_action">
                                            <a href="#">Place a bid</a>
                                        </div>
                                        <div className="nft__item_like">
                                            <i className="fa fa-heart"></i><span>50</span>
                                        </div>                            
                                    </div> 
                                </div>
                            </div>                                         
                    </div>
                </div>
            </section>

        </div>

  )

  
}
