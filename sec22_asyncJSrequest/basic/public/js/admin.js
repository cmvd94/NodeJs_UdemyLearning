/*js for frontend*/
const deleteProduct = btn => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    /*deleting article in dom*/
    const productElement = btn.closest('article');

    /*support browser for sending http request and also for sending data*/
    fetch('/admin/product/' + prodId, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf
      }//csurf doesnt just look at req.body ,it also look at query parameter & header
    })
      .then(result => {
        console.log(result);//op in browser
        return result.json();
      })
      .then(data => {
        console.log(data);
        productElement.parentNode.removeChild(productElement);
      })
      .catch(err => {
        console.log(err);
      });
  };
  