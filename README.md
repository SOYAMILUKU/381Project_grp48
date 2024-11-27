Online Book shop

Group: 48

Name: Lui Kwun Hei 	(13271519)
      Leung Ho Cheung 	(13742912)
      Ho Chung Wang 	(13343060)
      Hong Ming Yan 	(13019441)
github page:

# Installation	!!!IMPORTANT!!!
After you download the files, open cmd of the file "381project-<group 48>".

In cmd, run the command in order:
	1.npm install
	2.npm start 
		//This is to check your own port number.
		//Press ctrl+c to cancel connection.
	3.ssh-keygen
		//Enter file in which to save the key(press Enter),
		//Enter passphrase(press Enter),
		//Enter same passphrase again(press Enter).
		//A key's randomart should generate.
	4.ssh -R 381project-group48-onlinebookshop:80:localhost:<your own port number> serveo.net
		//cmd will show you two links, 1 for google, 1 for github. Choose the one you prefer and login.
		//For google,simply login.
		//For GitHub, after logging in, press "Authorize treverdixon"
		//Both methods lead to browser showing the following:
			//"Successfully verified <your email>"
		//Press ctrl+c to cancel connection.
	5.ssh -R 381project-group48-onlinebookshop:80:localhost:<your own port number> serveo.net
		//After running, the link available should appear in cmd.
			//Example:Forwarding HTTP traffic from https://381project-group48-onlinebookshop.serveo.net
		//Server is open after this. Run the link in other browsers to open the application.
********************************************
# Login
Through the login interface, each user can access by entering their username and password.

[
	{name: 'admin1', password: 'admintest1', state: 'admin'},
	{name: 'user1', password: 'usertest1', state: 'user'}
]

After successful login, username  will stored in session.

********************************************

# Logout

In the every page, user can logout their account by clicking logout button.

********************************************

# CRUD service
- Create
Click the create button to create book
User have to input the book information to create book.
    1) Book name
    2) Author
    3) Price
    4) BookDescription

A book document:
    {id: mongoose.Schema.ObjectId,
	bookName: String,
	author: String,
	price: Number,
	bookDescription: String
});

Create operation is post request, and all information is in body of request.
If successfully insert to the database, it will go to the home page.

********************************************
# CRUD service
- Read
- Click the find button to do the search

In the find page, user can input the book name to search the book.

After search success, the book will appear under the search button.

********************************************
# CRUD service
- Update

    User can update the book information by click the edit button on the bookdetail page.

    When you click the edit button, it will go to the update page. User can update the book information in this page.

    After update the book information, click the update button to update.

# CRUD service
- Delete
	User can click the delete button on the bookdetail page to delete the book

