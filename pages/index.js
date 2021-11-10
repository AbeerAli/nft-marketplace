/* pages/index.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    //const provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/94bea4e9c4c44bee84b20655e98271ec")

    const provider = new ethers.providers.JsonRpcProvider()
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
    const data = await marketContract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }


  return (

    <div className="no-bottom no-top" id="content">
            <div id="top"></div>
            <section id="section-hero" aria-label="section" className="pt20 pb20 vh-100" data-bgimage="url(images/background/8.jpg) bottom">
                <div id="particles-js"></div>
                <div className="v-center">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <div className="spacer-single"></div>
                                <h6 className="wow fadeInUp" data-wow-delay=".5s"><span className="text-uppercase id-color-2">Gigaland Market</span></h6>
                                <div className="spacer-10"></div>
                                <h1 className="wow fadeInUp" data-wow-delay=".75s">Create, sell and collect digital items.</h1>
                                <p className="wow fadeInUp lead" data-wow-delay="1s">
                                Unit of data stored on a digital ledger, called a blockchain, that certifies a digital asset to be unique and therefore not interchangeable</p>
                                <div className="spacer-10"></div>
                                <a href="03_grey-explore.html" className="btn-main wow fadeInUp lead" data-wow-delay="1.25s">Explore</a>                                
                                <div className="row">
                                    <div className="spacer-single"></div>
                                    <div className="row">
                                            <div className="col-lg-4 col-md-6 col-sm-4 wow fadeInRight mb30" data-wow-delay="1.1s">
                                                <div className="de_count text-left">
                                                    <h3><span>94215</span></h3>
                                                    <h5 className="id-color">Collectibles</h5>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6 col-sm-4 wow fadeInRight mb30" data-wow-delay="1.4s">
                                                <div className="de_count text-left">
                                                    <h3><span>27</span>k</h3>
                                                    <h5 className="id-color">Auctions</h5>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-md-6 col-sm-4 wow fadeInRight mb30" data-wow-delay="1.7s">
                                                <div className="de_count text-left">
                                                    <h3><span>4</span>k</h3>
                                                    <h5 className="id-color">NFT Artist</h5>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div className="col-md-6 xs-hide">
                                <img src="images/misc/women-with-vr.png" className="img-fluid wow fadeInUp" data-wow-delay=".75s" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section aria-label="section" className="no-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-2 col-sm-4 col-6 mb30">
                            <a className="box-url style-2" href="login.html">
                                <img src="images/wallet/1.png" alt="" className="mb20"/>
                                <h4>Metamask</h4>
                            </a>
                        </div>

                        <div className="col-lg-2 col-sm-4 col-6 mb30">
                            <a className="box-url style-2" href="login.html">
                                <img src="images/wallet/2.png" alt="" className="mb20"/>
                                <h4>Bitski</h4>
                            </a>
                        </div>       

                        <div className="col-lg-2 col-sm-4 col-6 mb30">
                            <a className="box-url style-2" href="login.html">
                                <img src="images/wallet/3.png" alt="" className="mb20"/>
                                <h4>Fortmatic</h4>
                            </a>
                        </div>    

                        <div className="col-lg-2 col-sm-4 col-6 mb30">
                            <a className="box-url style-2" href="login.html">
                                <img src="images/wallet/4.png" alt="" className="mb20"/>
                                <h4>WalletConnect</h4>
                            </a>
                        </div>

                        <div className="col-lg-2 col-sm-4 col-6 mb30">
                            <a className="box-url style-2" href="login.html">
                                <img src="images/wallet/5.png" alt="" className="mb20"/>
                                <h4>Coinbase Wallet</h4>
                            </a>
                        </div>

                        <div className="col-lg-2 col-sm-4 col-6 mb30">
                            <a className="box-url style-2" href="login.html">
                                <img src="images/wallet/6.png" alt="" className="mb20"/>
                                <h4>Arkane</h4>
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            <section id="section-collections" className="pt30 pb30">
                <div className="container">
                            
                            <div className="row wow fadeIn"> 
                                <div className="col-lg-12">
                                    <h2 className="style-2">New Items</h2>
                                </div>

                                <div id="items-carousel" className="owl-carousel wow fadeIn">

                                 {
                                     nfts.map((nft, i) => (

                                        <div key={i} className="d-item">
                                                <div className="nft__item style-2">
                                                    <div className="de_countdown" data-year="2021" data-month="9" data-day="20" data-hour="8"></div>
                                                    <div className="author_list_pp">
                                                        <a href="03_grey-author.html">                                    
                                                            <img className="lazy" src={nft.image} alt=""/>
                                                            <i className="fa fa-check"></i>
                                                        </a>
                                                    </div>
                                                    <div className="nft__item_wrap">
                                                        <a href="03_grey-item-details.html">
                                                            <img src={nft.image} className="lazy nft__item_preview" alt=""/>
                                                        </a>
                                                    </div>
                                                    <div className="nft__item_info">
                                                        <a href="03_grey-item-details.html">
                                                            <h4>Sunny Day</h4>
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
                                        ))
                                }
                                            
                                </div>

                              
                            </div>

                            <div className="spacer-single"></div>

                            <div className="row">
                                <div className="col-lg-12">
                                    <h2 className="style-2">Hot Collections</h2>
                                </div>
                                <div id="collection-carousel-alt" className="owl-carousel wow fadeIn">

                                        <div className="nft_coll style-2">
                                            <div className="nft_wrap">
                                                <a href="03_grey-collection.html"><img src="images/collections/coll-1.jpg" className="lazy img-fluid" alt=""/></a>
                                            </div>
                                            <div className="nft_coll_pp">
                                                <a href="03_grey-collection.html"><img className="lazy" src="images/author/author-1.jpg" alt=""/></a>
                                                <i className="fa fa-check"></i>
                                            </div>
                                            <div className="nft_coll_info">
                                                <a href="03_grey-collection.html"><h4>Abstraction</h4></a>
                                                <span>ERC-192</span>
                                            </div>
                                        </div>
                                    
                                        <div className="nft_coll style-2">
                                            <div className="nft_wrap">
                                                <a href="03_grey-collection.html"><img src="images/collections/coll-2.jpg" className="lazy img-fluid" alt=""/></a>
                                            </div>
                                            <div className="nft_coll_pp">
                                                <a href="03_grey-collection.html"><img className="lazy" src="images/author/author-2.jpg" alt=""/></a>
                                                <i className="fa fa-check"></i>
                                            </div>
                                            <div className="nft_coll_info">
                                                <a href="03_grey-collection.html"><h4>Patternlicious</h4></a>
                                                <span>ERC-61</span>
                                            </div>
                                        </div>
                                    
                                        <div className="nft_coll style-2">
                                            <div className="nft_wrap">
                                                <a href="03_grey-collection.html"><img src="images/collections/coll-3.jpg" className="lazy img-fluid" alt=""/></a>
                                            </div>
                                            <div className="nft_coll_pp">
                                                <a href="03_grey-collection.html"><img className="lazy" src="images/author/author-3.jpg" alt=""/></a>
                                                <i className="fa fa-check"></i>
                                            </div>
                                            <div className="nft_coll_info">
                                                <a href="03_grey-collection.html"><h4>Skecthify</h4></a>
                                                <span>ERC-126</span>
                                            </div>
                                        </div>
                                    
                                        <div className="nft_coll style-2">
                                            <div className="nft_wrap">
                                                <a href="03_grey-collection.html"><img src="images/collections/coll-4.jpg" className="lazy img-fluid" alt=""/></a>
                                            </div>
                                            <div className="nft_coll_pp">
                                                <a href="03_grey-collection.html"><img className="lazy" src="images/author/author-4.jpg" alt=""/></a>
                                                <i className="fa fa-check"></i>
                                            </div>
                                            <div className="nft_coll_info">
                                                <a href="03_grey-collection.html"><h4>Cartoonism</h4></a>
                                                <span>ERC-73</span>
                                            </div>
                                        </div>
                                    
                                        <div className="nft_coll style-2">
                                            <div className="nft_wrap">
                                                <a href="03_grey-collection.html"><img src="images/collections/coll-5.jpg" className="lazy img-fluid" alt=""/></a>
                                            </div>
                                            <div className="nft_coll_pp">
                                                <a href="03_grey-collection.html"><img className="lazy" src="images/author/author-5.jpg" alt=""/></a>
                                                <i className="fa fa-check"></i>
                                            </div>
                                            <div className="nft_coll_info">
                                                <a href="03_grey-collection.html"><h4>Virtuland</h4></a>
                                                <span>ERC-85</span>
                                            </div>
                                        </div>
                                    
                                        <div className="nft_coll style-2">
                                            <div className="nft_wrap">
                                                <a href="03_grey-collection.html"><img src="images/collections/coll-6.jpg" className="lazy img-fluid" alt=""/></a>
                                            </div>
                                            <div className="nft_coll_pp">
                                                <a href="03_grey-collection.html"><img className="lazy" src="images/author/author-6.jpg" alt=""/></a>
                                                <i className="fa fa-check"></i>
                                            </div>
                                            <div className="nft_coll_info">
                                                <a href="03_grey-collection.html"><h4>Papercut</h4></a>
                                                <span>ERC-42</span>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>

                                <div className="spacer-double"></div>

                                <div className="row">
                                    <div className="col-lg-12">
                                        <h2 className="style-2">Top Sellers</h2>
                                    </div>
                                    <div className="col-md-12 wow fadeIn">
                                        <ol className="author_list">
                                            <li>                                    
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">
                                                        <img className="lazy" src="images/author/author-1.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>                                    
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Monica Lucas</a>
                                                    <span>3.2 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-2.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Mamie Barnett</a>
                                                    <span>2.8 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-3.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Nicholas Daniels</a>
                                                    <span>2.5 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-4.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Lori Hart</a>
                                                    <span>2.2 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-5.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Jimmy Wright</a>
                                                    <span>1.9 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-6.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Karla Sharp</a>
                                                    <span>1.6 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-7.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Gayle Hicks</a>
                                                    <span>1.5 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-8.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Claude Banks</a>
                                                    <span>1.3 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-9.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Franklin Greer</a>
                                                    <span>0.9 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-10.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Stacy Long</a>
                                                    <span>0.8 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-11.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Ida Chapman</a>
                                                    <span>0.6 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="03_grey-author.html">                                    
                                                        <img className="lazy" src="images/author/author-12.jpg" alt=""/>
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="03_grey-author.html">Fred Ryan</a>
                                                    <span>0.5 eth</span>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                        </div>
            </section>

            <section id="section-text" className="no-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h2 className="style-2">Create and Sell Now</h2>
                        </div>

                        <div className="col-lg-4 col-md-6 mb-sm-30">
                            <div className="feature-box f-boxed style-3">
                                <i className="wow fadeInUp bg-color-2 i-boxed icon_wallet"></i>
                                <div className="text">
                                    <h4 className="wow fadeInUp">Set up your wallet</h4>
                                    <p className="wow fadeInUp" data-wow-delay=".25s">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                </div>
                                <i className="wm icon_wallet"></i>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-sm-30">
                            <div className="feature-box f-boxed style-3">
                                <i className="wow fadeInUp bg-color-2 i-boxed icon_cloud-upload_alt"></i>
                                <div className="text">
                                    <h4 className="wow fadeInUp">Add your NFT's</h4>
                                    <p className="wow fadeInUp" data-wow-delay=".25s">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                </div>
                                <i className="wm icon_cloud-upload_alt"></i>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-sm-30">
                            <div className="feature-box f-boxed style-3">
                                <i className="wow fadeInUp bg-color-2 i-boxed icon_tags_alt"></i>
                                <div className="text">
                                    <h4 className="wow fadeInUp">Sell your NFT's</h4>
                                    <p className="wow fadeInUp" data-wow-delay=".25s">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem.</p>
                                </div>
                                <i className="wm icon_tags_alt"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
  )
  
}
