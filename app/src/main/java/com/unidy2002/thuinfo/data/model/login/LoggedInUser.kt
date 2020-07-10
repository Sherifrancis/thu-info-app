package com.unidy2002.thuinfo.data.model.login

import com.sun.mail.imap.IMAPStore
import com.unidy2002.thuinfo.data.dao.HoleIgnoreDB
import com.unidy2002.thuinfo.data.dao.ReportIgnoreDB
import com.unidy2002.thuinfo.data.dao.ScheduleDBManager
import java.util.*

data class LoggedInUser(val userId: String, val password: String) {
    var rememberPassword = false
    var communityLoggedIn = false
    var fullName = ""
    var allowEnterCourseSelection = false

    lateinit var vpnTicket: String
    lateinit var userName: String
    lateinit var emailAddress: String
    lateinit var communityPassword: String

    lateinit var schedule: ScheduleDBManager
    lateinit var imapStore: IMAPStore
    lateinit var holeIgnore: HoleIgnoreDB
    lateinit var reportIgnore: ReportIgnoreDB

    var holeToken = ""
    var holeLoggedIn = false
    var currentImageBase64 = ""

    fun userNameInitialized() = ::userName.isInitialized
    fun emailAddressInitialized() = ::emailAddress.isInitialized
    fun scheduleInitialized() = ::schedule.isInitialized
    fun imapStoreInitialized() = ::imapStore.isInitialized
    fun holeIgnoreInitialized() = ::holeIgnore.isInitialized
    fun reportIgnoreInitialized() = ::reportIgnore.isInitialized

    val connectionState = mutableMapOf(792 to false, 824 to false, -1 to false, 2005 to false)

    val timerTasks = mutableListOf<TimerTask>()
}

private var loggedInUserInstance: LoggedInUser? = null

val loggedInUser: LoggedInUser get() = loggedInUserInstance ?: throw Exception("User not logged in!")

fun setUser(loggedInUser: LoggedInUser) {
    loggedInUserInstance = loggedInUser
}

fun revokeUser() {
    loggedInUserInstance = null
}