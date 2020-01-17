package com.unidy2002.thuinfo.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProviders
import androidx.navigation.fragment.NavHostFragment
import com.unidy2002.thuinfo.R

class HomeFragment : Fragment() {

    private lateinit var homeViewModel: HomeViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        homeViewModel =
            ViewModelProviders.of(this).get(HomeViewModel::class.java)
        return inflater.inflate(R.layout.fragment_home, container, false)
    }

    override fun onStart() {
        view?.findViewById<Button>(R.id.ecard_query_btn)?.setOnClickListener {
            NavHostFragment.findNavController(this)
                .navigate(R.id.ecardTableFragment)
        }
        /*view?.findViewById<Button>(R.id.gpa_btn)?.setOnClickListener {
            thread(start = true) {
                with(Network().getGPA().toString()) {
                    handler.post {
                        AlertDialog.Builder(view?.context!!)
                            .setTitle(this)
                            .setMessage(
                                "再接再厉~"
                            )
                            .show()
                    }
                }
            }
        }*/
        super.onStart()
    }
}