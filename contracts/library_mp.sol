pragma solidity ^0.4.24;

/**
 * author: Rajendra Maharjan
 * @title library_mp
 * @dev This is a common method library file.
 */
library library_mp {
   /**
   * @dev returns true if string parameter is empty and returns false if string parameter is not empty
   * @ param string value 
   * @ return if empty return true, false otherwise
   */
    function IsEmptyString(string strParam) public pure returns(bool)
    {
        bytes memory tempEmptyString = bytes(strParam); // Uses memory
        if (tempEmptyString.length == 0) {
            return true;
        }
        else {
            return false;
        }
    }
}