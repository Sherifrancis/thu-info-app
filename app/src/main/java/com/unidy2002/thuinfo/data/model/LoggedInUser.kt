package com.unidy2002.thuinfo.data.model

import com.sun.mail.imap.IMAPStore
import com.unidy2002.thuinfo.data.model.news.NewsContainer

data class LoggedInUser(val userId: String, val password: String) {
    var rememberPassword = false
    var fullName = ""
    lateinit var vpnTicket: String
    lateinit var personalCalendar: PersonalCalendar
    lateinit var communityTicket: String
    var dormitory = ""
    lateinit var userName: String
    lateinit var emailAddress: String
    lateinit var imapStore: IMAPStore

    fun calenderInitialized() = ::personalCalendar.isInitialized
    fun userNameInitialized() = ::userName.isInitialized
    fun emailAddressInitialized() = ::emailAddress.isInitialized
    fun imapStoreInitialized() = ::imapStore.isInitialized

    lateinit var newsContainer: NewsContainer

    val connectionState = mutableMapOf(792 to false, 824 to false, -1 to false)
}
