"use client";

import { useState, useEffect } from "react";
import swal from "sweetalert";

import ListingsCardList from "@/components/home/ListingsCardList";
import SearchHub from "@/components/home/SearchHub";
import PrivateRoute from "@/components/PrivateRoute";
import { departmentCategories } from "@/utils/departmentNames";
import axios from "@/utils/axios";
import {Listing} from '@/types/Listing';

const Home: React.FunctionComponent = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [searchExhausted, setSearchExhausted] = useState<Boolean>(false);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  const sortableKeys = ['default', 'updatedAt', 'ownerLastName', 'ownerFirstName', 'title']

  const [sortBy, setSortBy] = useState<string>(sortableKeys[0]);
  const [sortOrder, setSortOrder] = useState<number>(1);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleToggleSortDirection = () => {
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      setSortOrder(newDirection === 'asc' ? 1 : -1);
  };

  const [favListingsIds, setFavListingsIds] = useState<string[]>([]);

  const departmentKeys = Object.keys(departmentCategories).sort((a, b) => a.localeCompare(b));

  const reloadFavorites = async () => {
      axios.get('/users/favListingsIds', {withCredentials: true}).then((response) => {
          setFavListingsIds(response.data.favListingsIds);
      }).catch((error => {
          console.error("Error fetching user's favorite listings:", error);
          setFavListingsIds([]);
          swal({
              text: "Could not load your favorite listings",
              icon: "warning",
          })
      }));
  }

  useEffect(() => {
      reloadFavorites();
  }, []);

  const addListings = (newListings: Listing[]) => {
      setListings((oldListings) => [...oldListings, ...newListings]);
      setSearchExhausted(newListings.length < pageSize);
  };

  const resetListings = (newListings: Listing[]) => {
      setListings(newListings);
      setSearchExhausted(newListings.length < pageSize);
  };

  const updateFavorite = (listingId: string, favorite: boolean) => {
      const prevFavListingsIds = favListingsIds;
      
      if(favorite) {
          setFavListingsIds([listingId, ...prevFavListingsIds]);
  
          axios.put('/users/favListings', {withCredentials: true, data: {favListings: [listingId]}}).catch((error) => {
              setFavListingsIds(prevFavListingsIds);
              console.error('Error favoriting listing:', error);
              swal({
                  text: "Unable to favorite listing",
                  icon: "warning",
              })
              reloadFavorites();
          });
      } else {
          setFavListingsIds(prevFavListingsIds.filter((id) => id !== listingId));
  
          axios.delete('/users/favListings', {withCredentials: true, data: {favListings: [listingId]}}).catch((error) => {
              setFavListingsIds(prevFavListingsIds);
              console.error('Error unfavoriting listing:', error);
              swal({
                  text: "Unable to unfavorite listing",
                  icon: "warning",
              })
              reloadFavorites();
          });
      }
  };

  return (
    <div className="mx-auto max-w-[1300px] px-6 mt-24 w-full">
        <div className='mt-12'>
            <SearchHub 
                allDepartments={departmentKeys} 
                resetListings={resetListings} 
                addListings={addListings} 
                setIsLoading={setIsLoading} 
                sortBy={sortBy} 
                sortOrder={sortOrder} 
                setSortBy={setSortBy}
                setSortOrder={setSortOrder}
                sortDirection={sortDirection}
                onToggleSortDirection={handleToggleSortDirection}
                sortableKeys={sortableKeys}
                page={page} 
                setPage={setPage} 
                pageSize={pageSize}
            />
        </div>
        <div className='mt-4 md:mt-10'></div>
        {listings.length > 0 ? (
            <ListingsCardList 
                loading={isLoading} 
                searchExhausted={searchExhausted} 
                setPage={setPage} 
                listings={listings} 
                sortableKeys={sortableKeys} 
                sortBy={sortBy} 
                setSortBy={setSortBy} 
                setSortOrder={setSortOrder}
                sortDirection={sortDirection}
                onToggleSortDirection={handleToggleSortDirection}
                favListingsIds={favListingsIds} 
                updateFavorite={updateFavorite} 
            />
        ) : (
            <h4 style={{ color: "#838383", textAlign: 'center', paddingTop: '15%'}}>No results match the search criteria</h4>
        )}
    </div>
  );
}

export default function HomePage() {
    return <PrivateRoute Component={Home} unknownBlocked={true}></PrivateRoute>;
}