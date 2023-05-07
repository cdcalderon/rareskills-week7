The function withdraw() has a bug in which any item in the array can be accessed, but the elements are only deleted from the array using pop(), which deletes the last element. This allows users to be deleted from the array even if they are not the owner. Furthermore, this means that the same amount can be withdrawn more than once, as long as it is not the last item in the array "users".

The idea is to deposit twice as the attacker, making sure the attacker's struct is the last element in the array, and then withdraw once. In this way, the owner's deposit will be moved to the attacker's position and the attacker can withdraw it.

expectation is that this should work as expected and allow the attacker to steal the owner's deposit. Please let me know if you still encounter any issues or need further assistance.
