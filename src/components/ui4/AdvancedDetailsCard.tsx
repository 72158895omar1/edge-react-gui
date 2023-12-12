import { EdgeTransaction } from 'edge-core-js'
import React, { PureComponent } from 'react'

import { lstrings } from '../../locales/strings'
import { openBrowserUri } from '../../util/WebUtils'
import { ThemeProps, withTheme } from '../services/ThemeContext'
import { CardUi4 } from './CardUi4'
import { RowUi4 } from './RowUi4'

const localizedFeeText = {
  satPerVByte: lstrings.transaction_details_advance_details_satpervbyte,
  gasPrice: lstrings.transaction_details_advance_details_gasprice,
  gasLimit: lstrings.transaction_details_advance_details_gaslimit
}

const feeString = {
  high: lstrings.mining_fee_high_label_choice,
  standard: lstrings.mining_fee_standard_label_choice,
  low: lstrings.mining_fee_low_label_choice
}

interface OwnProps {
  transaction: EdgeTransaction
  url?: string
}

type Props = OwnProps & ThemeProps

export class AdvancedDetailsCardComponent extends PureComponent<Props> {
  getRecipientAddress = () => (this.props.transaction.spendTargets ? this.props.transaction.spendTargets[0].publicAddress : '')

  openUrl = () => {
    const { url } = this.props
    if (url == null || url === '') return
    openBrowserUri(url)
  }

  openProveUrl = () => {
    const { txid, txSecret } = this.props.transaction
    const recipientAddress = this.getRecipientAddress()
    if (recipientAddress === '' || txid === '' || txSecret == null) return
    const url = `https://blockchair.com/monero/transaction/${txid}?address=${recipientAddress}&viewkey=${txSecret}&txprove=1`
    openBrowserUri(url)
  }

  renderFeeOptions(): string {
    const { networkFeeOption, requestedCustomFee } = this.props.transaction

    if (networkFeeOption === 'custom') {
      return `${lstrings.mining_fee_custom_label_choice}\n${this.renderFees(requestedCustomFee)}`
    }

    return networkFeeOption != null ? feeString[networkFeeOption] : lstrings.mining_fee_standard_label_choice
  }

  renderFees(fees: any = {}): string {
    let feeValueText = ''

    for (const feeKey of Object.keys(fees)) {
      // @ts-expect-error
      const feeFullString = `${localizedFeeText[feeKey] ?? feeKey} ${fees[feeKey]}`
      feeValueText = feeValueText === '' ? feeValueText + feeFullString : feeValueText + `\n${feeFullString}`
    }

    return feeValueText
  }

  render() {
    const { url } = this.props
    const { feeRateUsed, networkFeeOption, ourReceiveAddresses, signedTx, txid, txSecret, deviceDescription } = this.props.transaction
    const recipientAddress = this.getRecipientAddress()
    let receiveAddressesString
    if (ourReceiveAddresses != null && ourReceiveAddresses.length > 0) {
      receiveAddressesString = ourReceiveAddresses.join('\n')
    }

    return (
      <CardUi4>
        {url != null && url !== '' && (
          <RowUi4
            type="touchable"
            title={lstrings.transaction_details_view_advanced_data}
            body={lstrings.transaction_details_advance_details_show_explorer}
            onPress={this.openUrl}
          />
        )}
        {receiveAddressesString != null && <RowUi4 title={lstrings.my_receive_addresses_title} body={receiveAddressesString} />}
        {networkFeeOption != null && <RowUi4 title={lstrings.transaction_details_advance_details_fee_setting} body={this.renderFeeOptions()} />}
        {feeRateUsed != null && <RowUi4 title={lstrings.transaction_details_advance_details_fee_used} body={this.renderFees(feeRateUsed)} />}
        {txSecret != null && <RowUi4 type="copy" title={lstrings.transaction_details_advance_details_txSecret} body={txSecret} />}
        {txSecret != null && recipientAddress !== '' && txid !== '' && (
          <RowUi4
            type="touchable"
            title={lstrings.transaction_details_advance_details_payment_proof}
            body={lstrings.transaction_details_advance_details_show_explorer}
            onPress={this.openProveUrl}
          />
        )}
        {signedTx != null && signedTx !== '' ? (
          <RowUi4 type="copy" title={lstrings.transaction_details_advance_details_raw_txbytes} body={signedTx} maximumHeight="small" />
        ) : null}

        {deviceDescription != null && <RowUi4 title={lstrings.transaction_details_advance_details_device} body={deviceDescription} />}
      </CardUi4>
    )
  }
}

export const AdvancedDetailsCard = withTheme(AdvancedDetailsCardComponent)
